'use client';

// =============================================
// DROPS WISHLIST PAGE
// View and manage saved drops
// =============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Clock, ArrowRight, Trash2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WishlistItem {
  wishlist_id: string;
  notify_on_drop: boolean;
  added_at: string;
  drop: {
    id: string;
    name: string;
    description: string;
    slug: string;
    drop_date: string;
    status: string;
    image_url?: string;
    early_access_gold: number;
    early_access_silver: number;
  };
}

export default function DropsWishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/drops/wishlist');
      const data = await res.json();

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (dropId: string) => {
    try {
      const res = await fetch(`/api/drops/wishlist?drop_id=${dropId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setWishlist(wishlist.filter(item => item.drop.id !== dropId));
        toast.success('Removed from wishlist');
      } else {
        toast.error(data.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Something went wrong');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-500',
      announced: 'bg-purple-500',
      live: 'bg-green-500',
      sold_out: 'bg-red-500',
      ended: 'bg-gray-500',
      cancelled: 'bg-gray-700',
    };

    return (
      <Badge className={`${colors[status] || 'bg-gray-500'} text-white`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getTimeUntilDrop = (dropDate: string) => {
    const now = new Date();
    const drop = new Date(dropDate);
    const diff = drop.getTime() - now.getTime();

    if (diff <= 0) return 'Drop has started';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Starting soon';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/account/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">My Drops Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'drop' : 'drops'} saved. You'll be notified before they go live.
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.wishlist_id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Drop Image */}
                  {item.drop.image_url && (
                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={item.drop.image_url}
                        alt={item.drop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(item.drop.status)}
                      </div>
                    </div>
                  )}

                  {/* Drop Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.drop.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.drop.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(item.drop.drop_date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {item.drop.status === 'scheduled' && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeUntilDrop(item.drop.drop_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => router.push(`/drops/${item.drop.slug}`)}
                      >
                        View Drop
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(item.drop.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    {/* Notification Status */}
                    {item.notify_on_drop && (
                      <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                        <Heart className="h-3 w-3 fill-current" />
                        You'll be notified before this drop
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your drops wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start adding drops you're interested in to get notified before they go live
              </p>
              <Button onClick={() => router.push('/drops')}>
                Browse Drops
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}