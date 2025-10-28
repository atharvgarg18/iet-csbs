import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  showBlurPlaceholder?: boolean;
}

/**
 * OptimizedImage Component
 * Provides progressive loading with blur effect, native lazy loading, and error handling
 */
export function OptimizedImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  showBlurPlaceholder = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }[aspectRatio];

  // Fallback image for errors
  const fallbackImage = '/placeholder.svg';

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClass, className)}>
      {/* Blur placeholder - shown while loading */}
      {showBlurPlaceholder && !isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Actual image */}
      <img
        src={hasError ? fallbackImage : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
}
