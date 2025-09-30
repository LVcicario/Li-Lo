'use client';

// =============================================
// DROPS PAGE - Sneaker Drops Calendar
// Exclusive timed releases with countdown
// =============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Lock, Star, Calendar, AlertCircle } from 'lucide-react';
import { Drop, calculateCountdown, getDropStatusBadge, getDropTypeBadge } from '@/types/drops';
import { MembershipTier } from '@/types/membership';

interface DropWithAccess extends Drop {
  userHasAccess: boolean;
  accessReason?: string;
  accessTime?: string;
  drop_products: any[];
}

export default function DropsPage() {
  const router = useRouter();
  const [drops, setDrops] = useState<DropWithAccess[]>([]);
  const [userTier, setUserTier] = useState<MembershipTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live'>('all');

  useEffect(() => {
    fetchDrops();
    const interval = setInterval(fetchDrops, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [filter]);

  const fetchDrops = async () => {
    try {
      const status = filter === 'upcoming' ? 'scheduled' : filter === 'live' ? 'live' : undefined;
      const url = status ? `/api/drops?status=${status}` : '/api/drops';

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setDrops(data.drops);
        setUserTier(data.userTier);
      }
    } catch (error) {
      console.error('Error fetching drops:', error);
    } finally {
      setLoading(false);
    }
  };

  const CountdownTimer = ({ drop }: { drop: DropWithAccess }) => {
    const [countdown, setCountdown] = useState(calculateCountdown(new Date(drop.drop_date)));

    useEffect(() => {
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(new Date(drop.drop_date)));
      }, 1000);

      return () => clearInterval(interval);
    }, [drop.drop_date]);

    if (countdown.isLive) {
      return (
        <div className="flex items-center gap-2 text-green-500 font-bold">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          LIVE NOW
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'D', value: countdown.days },
          { label: 'H', value: countdown.hours },
          { label: 'M', value: countdown.minutes },
          { label: 'S', value: countdown.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="bg-black/30 rounded-lg p-2">
            <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
    );
  };

  const TierBadge = ({ tier }: { tier?: MembershipTier }) => {
    if (!tier) return null;

    const colors = {
      bronze: 'from-orange-900 to-amber-700',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
    };

    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${colors[tier]} text-white text-xs font-bold`}>
        <Lock className="h-3 w-3" />
        {tier.toUpperCase()} REQUIRED
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading drops...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              EXCLUSIVE DROPS
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Limited sneaker releases. Don't miss out.
            </p>

            {/* User Tier Display */}
            {userTier && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">Your Tier: {userTier.toUpperCase()}</span>
              </div>
            )}
          </motion.div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mt-12">
            {['all', 'upcoming', 'live'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drops Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {drops.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No drops available</h2>
            <p className="text-gray-400">Check back soon for exclusive releases!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {drops.map((drop, index) => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all"
              >
                {/* Featured Badge */}
                {drop.is_featured && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </div>
                )}

                {/* Banner Image */}
                {drop.featured_image_url && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={drop.featured_image_url}
                      alt={drop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Drop Type & Status */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getDropTypeBadge(drop.drop_type).color}-500/20 text-${getDropTypeBadge(drop.drop_type).color}-400`}>
                      {getDropTypeBadge(drop.drop_type).label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${getDropStatusBadge(drop.status).color}-500/20 text-${getDropStatusBadge(drop.status).color}-400`}>
                      {getDropStatusBadge(drop.status).label}
                    </span>
                  </div>

                  {/* Drop Name */}
                  <h2 className="text-3xl font-bold">{drop.name}</h2>

                  {/* Description */}
                  {drop.description && (
                    <p className="text-gray-400">{drop.description}</p>
                  )}

                  {/* Tier Requirement */}
                  {drop.tier_requirement && (
                    <TierBadge tier={drop.tier_requirement} />
                  )}

                  {/* Countdown */}
                  {drop.status !== 'ended' && drop.status !== 'cancelled' && (
                    <CountdownTimer drop={drop} />
                  )}

                  {/* Product Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{drop.drop_products?.length || 0} products</span>
                    {drop.remaining_quantity !== undefined && (
                      <span>• {drop.remaining_quantity} left</span>
                    )}
                  </div>

                  {/* Access Status */}
                  {!drop.userHasAccess && drop.accessReason && (
                    <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-200">{drop.accessReason}</p>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => router.push(`/drops/${drop.id}`)}
                    disabled={!drop.userHasAccess}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      drop.userHasAccess
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {drop.userHasAccess ? 'View Drop' : 'Access Locked'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {userTier !== 'gold' && (
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 text-center"
          >
            <h3 className="text-3xl font-bold mb-4">Unlock Exclusive Drops</h3>
            <p className="text-gray-300 mb-6">
              Upgrade to Gold membership for 24h early access to all drops
            </p>
            <button
              onClick={() => router.push('/membership')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg font-bold text-black hover:scale-105 transition-transform"
            >
              Upgrade Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}