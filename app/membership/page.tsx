'use client';

// =============================================
// MEMBERSHIP PAGE - Upgrade/Downgrade Tiers
// Bronze → Silver → Gold Membership System
// =============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap, Shield, Clock, Gift, Sparkles } from 'lucide-react';
import { MembershipTierConfig, UserMembership } from '@/types/membership';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MembershipPage() {
  const router = useRouter();
  const [tiers, setTiers] = useState<MembershipTierConfig[]>([]);
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch tiers
      const tiersRes = await fetch('/api/membership');
      const tiersData = await tiersRes.json();
      if (tiersData.success) {
        setTiers(tiersData.tiers);
      }

      // Fetch current user membership
      const userRes = await fetch('/api/membership/user');
      const userData = await userRes.json();
      if (userData.success && userData.membership) {
        setCurrentMembership(userData.membership);
      }
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billing_period: billingPeriod }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return <Star className="h-8 w-8" />;
      case 'silver':
        return <Zap className="h-8 w-8" />;
      case 'gold':
        return <Crown className="h-8 w-8" />;
      default:
        return <Shield className="h-8 w-8" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'from-orange-900 via-amber-700 to-orange-900';
      case 'silver':
        return 'from-gray-400 via-gray-300 to-gray-500';
      case 'gold':
        return 'from-yellow-400 via-yellow-300 to-yellow-500';
      default:
        return 'from-gray-700 to-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              EXCLUSIVE MEMBERSHIP
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Unlock premium drops, early access, and VIP perks
            </p>

            {/* Current Tier Display */}
            {currentMembership && (
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">
                  Current Tier: {currentMembership.tier.toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <span className={billingPeriod === 'monthly' ? 'text-white font-semibold' : 'text-gray-500'}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-8' : ''
                }`}
              />
            </button>
            <span className={billingPeriod === 'yearly' ? 'text-white font-semibold' : 'text-gray-500'}>
              Yearly
              <Badge className="ml-2 bg-green-500 text-white">Save 17%</Badge>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => {
            const isCurrentTier = currentMembership?.tier === tier.tier;
            const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
            const monthlyPrice = billingPeriod === 'yearly' ? (tier.price_yearly / 12).toFixed(2) : price;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${
                  tier.tier === 'gold'
                    ? 'border-4 border-yellow-400 scale-105'
                    : 'border border-white/10'
                }`}
              >
                {/* Featured Badge */}
                {tier.tier === 'gold' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 rounded-full text-sm font-bold text-black">
                    MOST POPULAR
                  </div>
                )}

                <div className={`bg-gradient-to-br ${getTierGradient(tier.tier)} p-1`}>
                  <div className="bg-gray-900 rounded-xl p-8 h-full">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${getTierGradient(tier.tier)} mb-4`}>
                      {getTierIcon(tier.tier)}
                    </div>

                    {/* Tier Name */}
                    <h2 className="text-3xl font-bold mb-2">{tier.name}</h2>
                    <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">${monthlyPrice}</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-green-400 mt-2">
                          ${tier.price_yearly}/year (save ${(tier.price_monthly * 12 - tier.price_yearly).toFixed(2)})
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {(typeof tier.features === 'string'
                        ? JSON.parse(tier.features)
                        : tier.features
                      ).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Perks Highlights */}
                    <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/10">
                      {tier.early_access_hours > 0 && (
                        <div className="text-center">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                          <p className="text-xs text-gray-400">{tier.early_access_hours}h Early Access</p>
                        </div>
                      )}
                      {tier.discount_percentage > 0 && (
                        <div className="text-center">
                          <Gift className="h-5 w-5 mx-auto mb-1 text-purple-400" />
                          <p className="text-xs text-gray-400">{tier.discount_percentage}% Discount</p>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {isCurrentTier ? (
                      <Button
                        disabled
                        className="w-full py-6 text-lg bg-gray-700 text-gray-400 cursor-not-allowed"
                      >
                        Current Plan
                      </Button>
                    ) : tier.tier === 'bronze' && !currentMembership ? (
                      <Button
                        onClick={() => router.push('/auth/register')}
                        className="w-full py-6 text-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
                      >
                        Get Started Free
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(tier.tier)}
                        className={`w-full py-6 text-lg font-bold ${
                          tier.tier === 'gold'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black'
                            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                        }`}
                      >
                        {currentMembership ? 'Upgrade Now' : 'Subscribe Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">Why Upgrade?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-12 w-12" />,
                title: 'Early Access',
                description: 'Get first dibs on exclusive drops before anyone else',
              },
              {
                icon: <Gift className="h-12 w-12" />,
                title: 'Premium Discounts',
                description: 'Save up to 20% on all purchases with Gold membership',
              },
              {
                icon: <Crown className="h-12 w-12" />,
                title: 'VIP Events',
                description: 'Exclusive invitations to product launches and private sales',
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-center p-8 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 mb-4 text-yellow-400">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}