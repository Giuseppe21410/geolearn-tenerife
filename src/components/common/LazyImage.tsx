import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  preload?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  preload = false,
  className = '',
  style,
  ...restProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (preload && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [preload, src]);

  return (
    <img
      src={src}
      alt={alt}
      loading={preload ? 'eager' : 'lazy'}
      decoding="async"
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={() => setIsLoaded(true)}
      style={{
        transition: 'opacity 0.3s ease-out',
        opacity: isLoaded ? 1 : 0,
        ...style,
      }}
      {...restProps}
    />
  );
};

export default LazyImage;

