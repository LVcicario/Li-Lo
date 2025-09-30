'use client';

// =============================================
// DROP DETAIL PAGE - Individual Drop with Products
// Countdown, products, tier-based pricing
// =============================================

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Lock, ShoppingCart, Bell, AlertCircle, Check } from 'lucide-react';
import { Drop, DropProduct, calculateCountdown, getPriceForTier } from '@/types/drops';
import { MembershipTier } from '@/types/membership';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface DropWithAccess extends Drop {
  userHasAccess: boolean;
  accessReason?: string;
  accessTime?: string;
  drop_products: DropProduct[];
}

export default function DropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [drop, setDrop] = useState<DropWithAccess | null>(null);
  const [userTier, setUserTier] = useState<MembershipTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchDropDetails();
    }
  }, [params.id]);

  const fetchDropDetails = async () => {
    try {
      const response = await fetch(`/api/drops/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setDrop(data.drop);
        setUserTier(data.userTier);
      }
    } catch (error) {
      console.error('Error fetching drop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyMe = async () => {
    try {
      const response = await fetch(`/api/drops/${params.id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_type: 'all' }),
      });

      if (response.ok) {
        setNotificationEnabled(true);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  const CountdownTimer = ({ dropDate }: { dropDate: string }) => {
    const [countdown, setCountdown] = useState(calculateCountdown(new Date(dropDate)));

    useEffect(() => {
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(new Date(dropDate)));
      }, 1000);

      return () => clearInterval(interval);
    }, [dropDate]);

    if (countdown.isLive) {
      return (
        <div className="flex items-center justify-center gap-3 text-green-500 text-2xl font-bold">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          DROP IS LIVE
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {[
          { label: 'Days', value: countdown.days },
          { label: 'Hours', value: countdown.hours },
          { label: 'Minutes', value: countdown.minutes },
          { label: 'Seconds', value: countdown.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-4xl font-bold mb-1">{value.toString().padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 uppercase">{label}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading drop...</div>
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Drop Not Found</h1>
          <Button onClick={() => router.push('/drops')}>Back to Drops</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Banner */}
      {drop.banner_image_url && (
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            src={drop.banner_image_url}
            alt={drop.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className="bg-red-500 text-white">
              {drop.drop_type.toUpperCase()}
            </Badge>
            {drop.tier_requirement && (
              <Badge className="bg-yellow-500 text-black">
                <Lock className="h-3 w-3 mr-1" />
                {drop.tier_requirement.toUpperCase()} REQUIRED
              </Badge>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {drop.name}
          </h1>

          {drop.description && (
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {drop.description}
            </p>
          )}
        </motion.div>

        {/* Countdown */}
        {drop.status !== 'ended' && drop.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="h-6 w-6 text-red-500" />
                <h2 className="text-2xl font-bold">
                  {drop.status === 'live' ? 'Ends In' : 'Drops In'}
                </h2>
              </div>
              <CountdownTimer dropDate={drop.drop_date} />
            </div>
          </motion.div>
        )}

        {/* Access Warning */}
        {!drop.userHasAccess && drop.accessReason && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-200 mb-2">Access Restricted</h3>
                <p className="text-yellow-100/90">{drop.accessReason}</p>
                <Button
                  onClick={() => router.push('/membership')}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                  Upgrade Membership
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drop.drop_products?.map((dropProduct, index) => {
              const product = dropProduct.product;
              const price = getPriceForTier(dropProduct, userTier);

              return (
                <motion.div
                  key={dropProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all group"
                >
                  {/* Product Image */}
                  {product?.image_url && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product?.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product?.brand}</p>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold">${price}</span>
                        {userTier && userTier !== 'bronze' && dropProduct.bronze_price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${dropProduct.bronze_price}
                          </span>
                        )}
                      </div>
                      {dropProduct.sold_quantity !== undefined && (
                        <Badge variant="outline">
                          {dropProduct.drop_quantity! - dropProduct.sold_quantity} left
                        </Badge>
                      )}
                    </div>

                    {/* CTA */}
                    {drop.userHasAccess ? (
                      <Button
                        onClick={() => router.push(`/sneakers/${product?.id}`)}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Product
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Notify Me Section */}
        {!drop.userHasAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 text-center"
          >
            <Bell className="h-12 w-12 mx-auto mb-4 text-blue-400" />
            <h3 className="text-2xl font-bold mb-2">Want Early Access?</h3>
            <p className="text-gray-300 mb-6">
              Upgrade to {drop.tier_requirement || 'Silver'} and be the first to shop this drop
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push('/membership')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold"
              >
                Upgrade Now
              </Button>
              {!notificationEnabled ? (
                <Button
                  onClick={handleNotifyMe}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              ) : (
                <Button disabled className="border-green-500 text-green-400">
                  <Check className="h-4 w-4 mr-2" />
                  Notifications Enabled
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}