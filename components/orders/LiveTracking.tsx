'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Bell,
  Share2,
  MessageCircle,
  Camera,
  RotateCw,
  ChevronRight,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, formatDistance, addHours } from 'date-fns';
import { useMockData } from '@/lib/hooks/useMockData';

interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  icon?: any;
}

interface OrderTrackingProps {
  orderId: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  currentStatus: string;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    image?: string;
  }>;
}

export function LiveOrderTracking({
  orderId,
  orderNumber,
  trackingNumber,
  carrier = 'DHL',
  estimatedDelivery,
  currentStatus,
  items = []
}: OrderTrackingProps) {
  const [trackingData, setTrackingData] = useState<{
    status: string;
    location: string;
    estimatedDelivery: string;
    events: TrackingEvent[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const { isUsingMockData, trackOrder } = useMockData();

  useEffect(() => {
    loadTrackingData();
    // Simulate real-time updates
    const interval = setInterval(loadTrackingData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [orderId, isUsingMockData]);

  const loadTrackingData = async () => {
    try {
      if (isUsingMockData) {
        const data = await trackOrder(orderId);
        setTrackingData(data);

        // Simulate delivery photo for delivered orders
        if (currentStatus === 'delivered') {
          setDeliveryPhoto('/api/placeholder/400/300');
        }
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = () => {
    if (!notificationsEnabled) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            toast.success('Push notifications enabled for this order');
            new Notification('Order Tracking Enabled', {
              body: `You will receive updates for order ${orderNumber}`,
              icon: '/logo.png'
            });
          }
        });
      }
    } else {
      setNotificationsEnabled(false);
      toast.info('Push notifications disabled');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/track/${orderId}`;
    if (navigator.share) {
      navigator.share({
        title: `Track Order ${orderNumber}`,
        text: `Track my order from Li-Lo Sneakers`,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Tracking link copied to clipboard');
    }
  };

  const handleReorder = () => {
    toast.success('Added items to cart for quick reorder');
  };

  const getStatusProgress = () => {
    const statuses = ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus.toLowerCase().replace(' ', '_'));
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  const getEstimatedTime = () => {
    if (!trackingData?.estimatedDelivery) return null;
    const now = new Date();
    const delivery = new Date(trackingData.estimatedDelivery);
    if (delivery > now) {
      return formatDistance(delivery, now, { addSuffix: true });
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Status Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-800 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Order {orderNumber}</h2>
              <p className="text-gray-300">
                {trackingNumber && `${carrier} • ${trackingNumber}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleNotificationToggle}
                className={notificationsEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getStatusProgress()}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-3 bg-white/10 rounded-full"
                >
                  {currentStatus === 'delivered' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Truck className="w-6 h-6" />
                  )}
                </motion.div>
                <div>
                  <p className="text-lg font-semibold">
                    {trackingData?.status || currentStatus}
                  </p>
                  <p className="text-sm text-gray-300">
                    {trackingData?.location}
                  </p>
                </div>
              </div>
              {getEstimatedTime() && (
                <div className="text-right">
                  <p className="text-sm text-gray-300">Estimated delivery</p>
                  <p className="text-lg font-semibold">{getEstimatedTime()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Map Placeholder */}
          <div className="mb-6">
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <motion.div
                animate={{ x: [-100, 400] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 -translate-y-1/2"
              >
                <Truck className="w-8 h-8 text-black" />
              </motion.div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Live tracking map • Your package is on the way
            </p>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-3">Delivery Timeline</h3>
            {trackingData?.events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-black' : 'bg-gray-300'
                  }`} />
                  {index < (trackingData?.events.length || 0) - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 -mt-1">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'MMM dd, HH:mm')} • {event.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Delivery Photo (if delivered) */}
          {currentStatus === 'delivered' && deliveryPhoto && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-900">Delivery Confirmation</p>
              </div>
              <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={deliveryPhoto}
                  alt="Delivery photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-green-700 mt-2">
                Package delivered and photographed at delivery location
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowShareDialog(true)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" onClick={handleReorder}>
              <RotateCw className="mr-2 h-4 w-4" />
              Order Again
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Items in this shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Get help with your order {orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button className="w-full" variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Help Center
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Or call us at</p>
              <p className="font-bold">+1 (800) 555-0123</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}