'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px',
  });

  const shouldLoad = priority || inView;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-200 flex items-center justify-center',
          className
        )}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
        }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {shouldLoad && (
        <>
          {/* Loading skeleton */}
          {!isLoaded && (
            <div
              className={cn(
                'absolute inset-0 bg-gray-200 animate-pulse',
                className
              )}
            />
          )}

          {/* Actual image */}
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes || '100vw'}
              quality={quality}
              priority={priority}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                className
              )}
              style={{
                objectFit: 'cover',
              }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width || 500}
              height={height || 500}
              quality={quality}
              priority={priority}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                className
              )}
            />
          )}
        </>
      )}
    </div>
  );
}