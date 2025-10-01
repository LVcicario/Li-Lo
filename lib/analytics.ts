// Analytics Configuration
interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  userId?: string
  properties?: Record<string, any>
}

// Google Analytics 4
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    plausible?: (...args: any[]) => void
  }
}

class Analytics {
  private initialized = false

  init() {
    if (this.initialized || typeof window === 'undefined') return

    // Initialize Google Analytics
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.initGA()
    }

    // Initialize Plausible
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      this.initPlausible()
    }

    this.initialized = true
  }

  private initGA() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    if (!GA_ID) return

    // Load GA4 script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname,
    })
  }

  private initPlausible() {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    if (!domain) return

    const script = document.createElement('script')
    script.src = 'https://plausible.io/js/script.js'
    script.defer = true
    script.dataset.domain = domain
    document.head.appendChild(script)
  }

  // Track page views
  pageView(url?: string) {
    if (!this.initialized) this.init()

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: url || window.location.pathname,
      })
    }

    // Plausible tracks automatically
  }

  // Track custom events
  event({ action, category, label, value, properties }: AnalyticsEvent) {
    if (!this.initialized) this.init()

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...properties,
      })
    }

    // Plausible custom events
    if (window.plausible) {
      window.plausible(action, {
        props: { category, label, ...properties }
      })
    }
  }

  // E-commerce specific events
  trackPurchase(orderId: string, value: number, items: any[]) {
    this.event({
      action: 'purchase',
      category: 'ecommerce',
      label: orderId,
      value,
      properties: {
        transaction_id: orderId,
        value,
        currency: 'EUR',
        items,
      }
    })
  }

  trackAddToCart(productId: string, productName: string, value: number) {
    this.event({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: productName,
      value,
      properties: {
        item_id: productId,
        item_name: productName,
        value,
        currency: 'EUR',
      }
    })
  }

  trackViewItem(productId: string, productName: string, value: number) {
    this.event({
      action: 'view_item',
      category: 'ecommerce',
      label: productName,
      value,
      properties: {
        item_id: productId,
        item_name: productName,
        value,
        currency: 'EUR',
      }
    })
  }

  trackSearch(searchTerm: string, resultsCount: number) {
    this.event({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      value: resultsCount,
      properties: {
        search_term: searchTerm,
        results_count: resultsCount,
      }
    })
  }

  trackSignUp(method: string) {
    this.event({
      action: 'sign_up',
      category: 'auth',
      label: method,
      properties: {
        method,
      }
    })
  }

  trackLogin(method: string) {
    this.event({
      action: 'login',
      category: 'auth',
      label: method,
      properties: {
        method,
      }
    })
  }

  // User identification for better tracking
  identify(userId: string, traits?: Record<string, any>) {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        user_id: userId,
        user_properties: traits,
      })
    }
  }

  // Track timing (performance)
  trackTiming(category: string, variable: string, time: number, label?: string) {
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        event_label: label,
      })
    }
  }
}

export const analytics = new Analytics()