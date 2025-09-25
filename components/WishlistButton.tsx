'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useAuthStore } from '@/lib/auth-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  productName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function WishlistButton({
  productId,
  productName = 'Product',
  className,
  size = 'md',
  showText = false
}: WishlistButtonProps) {
  const { user } = useAuthStore()
  const { items, addItem, removeItem } = useWishlistStore()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if item is in wishlist
    const inWishlist = items.some(item => item.product_id === productId)
    setIsInWishlist(inWishlist)
  }, [items, productId])

  const handleToggleWishlist = async () => {
    setLoading(true)

    try {
      if (isInWishlist) {
        // Find the wishlist item to remove
        const wishlistItem = items.find(item => item.product_id === productId)
        if (wishlistItem) {
          await removeItem(wishlistItem.id)
          toast.success(`${productName} removed from wishlist`)
        }
      } else {
        // Add to wishlist
        await addItem(productId, {
          notify_price_drop: true,
          notify_back_in_stock: true,
          priority: 'medium'
        })
        toast.success(`${productName} added to wishlist!`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleWishlist}
      disabled={loading}
      className={cn(
        'relative flex items-center justify-center rounded-full',
        'bg-black/50 backdrop-blur-sm hover:bg-black/70',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin text-white')} />
      ) : (
        <>
          <Heart
            className={cn(
              iconSizes[size],
              'transition-all duration-300',
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-white'
            )}
          />
          {isInWishlist && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-red-500/30"
            />
          )}
        </>
      )}

      {showText && (
        <span className="ml-2 text-sm text-white">
          {loading ? 'Loading...' : isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </motion.button>
  )
}