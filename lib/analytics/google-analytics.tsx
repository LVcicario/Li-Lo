'use client';

// =============================================
// GOOGLE ANALYTICS 4 INTEGRATION
// Client-side analytics tracking
// =============================================

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) {
    console.warn('Google Analytics ID not configured');
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Event tracking functions
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// E-commerce tracking
export const trackPurchase = (
  transactionId: string,
  value: number,
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
  }>
) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'EUR',
    items,
  });
};

export const trackAddToCart = (
  item: {
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
  }
) => {
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [item],
  });
};

export const trackViewItem = (
  item: {
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
  }
) => {
  trackEvent('view_item', {
    currency: 'EUR',
    value: item.price,
    items: [item],
  });
};

export const trackBeginCheckout = (
  value: number,
  items: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    item_brand?: string;
    price: number;
    quantity: number;
  }>
) => {
  trackEvent('begin_checkout', {
    currency: 'EUR',
    value,
    items,
  });
};

// Membership tracking
export const trackMembershipPurchase = (
  tier: string,
  value: number,
  billingPeriod: string
) => {
  trackEvent('membership_purchase', {
    tier,
    value,
    currency: 'EUR',
    billing_period: billingPeriod,
  });
};

// Drop tracking
export const trackDropView = (dropId: string, dropName: string) => {
  trackEvent('view_drop', {
    drop_id: dropId,
    drop_name: dropName,
  });
};

export const trackDropNotification = (dropId: string, dropName: string) => {
  trackEvent('subscribe_drop_notification', {
    drop_id: dropId,
    drop_name: dropName,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};