'use client';

import React from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  quality = 75,
}: ResponsiveImageProps) {
  // Ensure alt text is provided for accessibility
  if (!alt) {
    console.warn('ResponsiveImage: alt text is required for accessibility');
  }

  const imageProps = {
    src,
    alt,
    className: `${className} transition-opacity duration-300`,
    priority,
    quality,
    sizes,
    loading: priority ? 'eager' as const : 'lazy' as const,
  };

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        style={{ objectFit: 'cover' }}
      />
    );
  }

  if (width && height) {
    return (
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
    );
  }

  // Fallback with responsive sizing
  return (
    <Image
      {...imageProps}
      width={800}
      height={600}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  );
}

export default ResponsiveImage;