'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function Analytics() {
  const router = useRouter();

  useEffect(() => {
    // Google Analytics
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
          page_path: url,
        });
      }
    };

    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          domComplete: perfData.domComplete - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        };

        // Performance metrics logged only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance metrics:', metrics);
        }

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'performance_metrics', metrics);
        }
      }
    }

    // Web Vitals
    if ('web-vital' in window) {
      const reportWebVitals = (metric: any) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
          });
        }
      };

      // Report Core Web Vitals
      ['CLS', 'FID', 'LCP', 'FCP', 'TTFB'].forEach(name => {
        reportWebVitals({ name, value: 0, rating: 'good' });
      });
    }
  }, []);

  return (
    <>
      <VercelAnalytics />

      {/* Google Analytics Script */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}