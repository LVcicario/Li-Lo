// =============================================
// LAZY LOADING UTILITIES
// Dynamic imports for better performance
// =============================================

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

// Loading fallback component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Lazy load heavy components
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false, loading: () => <div /> }
);

// Helper function to create lazy loaded component
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    ssr?: boolean;
    loading?: () => ReactNode;
  }
) {
  return dynamic(importFn, {
    ssr: options?.ssr ?? true,
    loading: options?.loading ?? LoadingSpinner,
  });
}