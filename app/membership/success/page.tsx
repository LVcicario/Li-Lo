'use client';

// =============================================
// MEMBERSHIP SUCCESS PAGE
// After successful Stripe checkout
// =============================================

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MembershipSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      router.push('/membership');
      return;
    }

    // Fetch membership details
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    try {
      const response = await fetch('/api/membership/user');
      const data = await response.json();

      if (data.success && data.membership) {
        setMembership(data.membership);
      }
    } catch (error) {
      console.error('Error fetching membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    if (tier === 'gold') return <Crown className="h-16 w-16 text-yellow-500" />;
    if (tier === 'silver') return <Zap className="h-16 w-16 text-gray-400" />;
    return <Sparkles className="h-16 w-16 text-orange-600" />;
  };

  const getTierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getTierBenefits = (tier: string) => {
    if (tier === 'gold') {
      return [
        '24h early access to ALL drops',
        '20% discount on all purchases',
        'Free express shipping worldwide',
        '24/7 VIP phone support',
        'Exclusive Gold-only ultra-rare drops',
        'Private shopping events',
        'Concierge service',
        'Sneaker authentication',
      ];
    }
    if (tier === 'silver') {
      return [
        '12h early access to drops',
        '10% discount on all purchases',
        'Free standard shipping',
        'Priority email support',
        'Exclusive Silver-only drops',
        'Early sale access',
        'Birthday rewards',
      ];
    }
    return ['Access to standard drops', 'Browse all products', 'Email support'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Membership not found. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <CheckCircle className="h-24 w-24 text-green-500" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              {getTierIcon(membership.tier)}
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome to {getTierName(membership.tier)} Membership! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your membership is now active and ready to use
          </p>
        </motion.div>

        {/* Membership Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 border-2 shadow-xl">
            <CardHeader className={`
              ${membership.tier === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}
              ${membership.tier === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' : ''}
              ${membership.tier === 'bronze' ? 'bg-gradient-to-r from-orange-600 to-orange-800' : ''}
              text-white
            `}>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {getTierName(membership.tier)} Member
                </span>
                <span className="text-sm opacity-90">
                  {membership.billing_period === 'yearly' ? 'Annual' : 'Monthly'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Your Benefits:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getTierBenefits(membership.tier).map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {membership.current_period_end && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Your membership renews on:{' '}
                    <span className="font-semibold text-gray-900">
                      {new Date(membership.current_period_end).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-6">What's Next?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/drops')}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Explore Exclusive Drops</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Check out upcoming drops you now have early access to
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      View Drops <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/sneakers')}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Crown className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Start Shopping with Discount</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Your {membership.tier === 'gold' ? '20%' : '10%'} discount is already applied
                    </p>
                    <Button variant="link" className="p-0 h-auto">
                      Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function MembershipSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <MembershipSuccessContent />
    </Suspense>
  );
}