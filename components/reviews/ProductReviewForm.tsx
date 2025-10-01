'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ProductReviewFormProps {
  productId: string
  productName: string
  orderItemId?: string
  onSuccess?: () => void
}

export function ProductReviewForm({
  productId,
  productName,
  orderItemId,
  onSuccess
}: ProductReviewFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [images, setImages] = useState<string[]>([])

  // Detailed ratings
  const [qualityRating, setQualityRating] = useState(5)
  const [authenticityRating, setAuthenticityRating] = useState(5)
  const [comfortRating, setComfortRating] = useState(5)
  const [styleRating, setStyleRating] = useState(5)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: string[] = []
    for (let i = 0; i < Math.min(files.length, 5 - images.length); i++) {
      const file = files[i]
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        continue
      }

      // Convert to base64 for demo (in production, upload to storage)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          newImages.push(reader.result as string)
          if (newImages.length === files.length || i === files.length - 1) {
            setImages([...images, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!title.trim()) {
      toast.error('Please add a title to your review')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please login to submit a review')
        router.push('/auth/login')
        return
      }

      // Create review
      const { data: review, error: reviewError } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          order_item_id: orderItemId,
          rating,
          title,
          review_text: reviewText,
          quality_rating: qualityRating,
          authenticity_rating: authenticityRating,
          comfort_rating: comfortRating,
          style_rating: styleRating,
          is_verified_purchase: !!orderItemId
        })
        .select()
        .single()

      if (reviewError) throw reviewError

      // Upload images if any
      if (images.length > 0 && review) {
        const imageInserts = images.map((url, index) => ({
          review_id: review.id,
          url,
          alt_text: `${productName} review image ${index + 1}`
        }))

        const { error: imagesError } = await supabase
          .from('review_images')
          .insert(imageInserts)

        if (imagesError) {
          console.error('Error uploading images:', imagesError)
        }
      }

      toast.success('Thank you for your review!')

      // Reset form
      setRating(5)
      setTitle('')
      setReviewText('')
      setImages([])
      setQualityRating(5)
      setAuthenticityRating(5)
      setComfortRating(5)
      setStyleRating(5)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Error submitting review:', error)
      toast.error(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const RatingStars = ({
    value,
    onChange,
    size = 'default'
  }: {
    value: number;
    onChange: (rating: number) => void;
    size?: 'small' | 'default' | 'large'
  }) => {
    const sizes = {
      small: 'w-4 h-4',
      default: 'w-6 h-6',
      large: 'w-8 h-8'
    }

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                sizes[size],
                "transition-colors",
                (hoveredRating || value) >= star
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-600"
              )}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 font-mono tracking-wider">
        WRITE A REVIEW
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Overall Rating
          </label>
          <div className="flex items-center gap-4">
            <RatingStars value={rating} onChange={setRating} size="large" />
            <span className="text-sm text-gray-400">
              {rating === 5 && 'Excellent!'}
              {rating === 4 && 'Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Poor'}
              {rating === 1 && 'Terrible'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your review in a few words"
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us about your experience with this product..."
            rows={5}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
          />
        </div>

        {/* Detailed Ratings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Rate specific aspects</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Quality</span>
              <RatingStars value={qualityRating} onChange={setQualityRating} size="small" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Authenticity</span>
              <RatingStars value={authenticityRating} onChange={setAuthenticityRating} size="small" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Comfort</span>
              <RatingStars value={comfortRating} onChange={setComfortRating} size="small" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Style</span>
              <RatingStars value={styleRating} onChange={setStyleRating} size="small" />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add Photos (Optional)
          </label>
          <div className="flex flex-wrap gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <img
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-white transition-colors">
                <Camera className="w-6 h-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Add up to 5 photos. Max 5MB per image.
          </p>
        </div>

        {/* Verified Purchase Badge */}
        {orderItemId && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-500">Verified Purchase</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || !title.trim()}
          className="w-full py-4 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              SUBMITTING...
            </>
          ) : (
            'SUBMIT REVIEW'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our review guidelines and terms of service.
          Reviews are subject to moderation.
        </p>
      </form>
    </motion.div>
  )
}