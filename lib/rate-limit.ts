import { NextRequest } from 'next/server'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
}

interface RequestLog {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production)
const requests = new Map<string, RequestLog>()

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests' } = options

  return async (request: NextRequest) => {
    // Get client identifier (IP + User-Agent for better uniqueness)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const key = `${ip}:${userAgent}`

    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [k, v] of requests.entries()) {
      if (v.resetTime < now) {
        requests.delete(k)
      }
    }

    // Get or create request log
    let requestLog = requests.get(key)
    if (!requestLog || requestLog.resetTime < now) {
      requestLog = {
        count: 0,
        resetTime: now + windowMs
      }
    }

    // Check if limit exceeded
    if (requestLog.count >= maxRequests) {
      return {
        success: false,
        error: message,
        retryAfter: Math.ceil((requestLog.resetTime - now) / 1000)
      }
    }

    // Increment counter
    requestLog.count++
    requests.set(key, requestLog)

    return {
      success: true,
      remaining: maxRequests - requestLog.count,
      resetTime: requestLog.resetTime
    }
  }
}

// Predefined rate limiters
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  message: 'Too many requests. Please try again later.'
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
  message: 'Too many authentication attempts. Please try again later.'
})

export const paymentRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 payment attempts per hour
  message: 'Too many payment attempts. Please try again later.'
})