'use client';

// =============================================
// WISHLIST BUTTON COMPONENT
// Add/remove drops from user wishlist
// =============================================

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface WishlistButtonProps {
  dropId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function WishlistButton({
  dropId,
  variant = 'ghost',
  size = 'icon',
  showText = false,
}: WishlistButtonProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, dropId]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch('/api/drops/wishlist');
      const data = await res.json();

      if (data.success) {
        const inWishlist = data.wishlist.some(
          (item: any) => item.drop.id === dropId
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleClick = async () => {
    if (!user) {
      toast.error('Please sign in to add drops to your wishlist');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const res = await fetch(`/api/drops/wishlist?drop_id=${dropId}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (data.success) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          toast.error(data.error || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const res = await fetch('/api/drops/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ drop_id: dropId, notify_on_drop: true }),
        });

        const data = await res.json();

        if (data.success) {
          setIsInWishlist(true);
          toast.success('Added to wishlist! You\'ll be notified before the drop.');
        } else if (res.status === 409) {
          setIsInWishlist(true);
          toast.info('Already in wishlist');
        } else {
          toast.error(data.error || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={`${isInWishlist ? 'text-red-500 hover:text-red-600' : ''}`}
    >
      <Heart
        className={`${size === 'icon' ? 'h-5 w-5' : 'h-4 w-4'} ${
          isInWishlist ? 'fill-current' : ''
        }`}
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}