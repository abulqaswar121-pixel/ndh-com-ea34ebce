type ResponsiveImageProps = {
  name: 'ndh-hero' | 'ndh-agency-work' | 'ndh-academy';
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
};

export function ResponsiveImage({
  name,
  alt,
  width,
  height,
  priority = false,
  sizes = '(max-width: 760px) 100vw, 50vw',
}: ResponsiveImageProps) {
  const widths = [640, 960, 1280];
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={widths.map((value) => `/images/${name}-${value}.avif ${value}w`).join(', ')}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={widths.map((value) => `/images/${name}-${value}.webp ${value}w`).join(', ')}
        sizes={sizes}
      />
      <img
        src={`/images/${name}-960.webp`}
        srcSet={widths.map((value) => `/images/${name}-${value}.webp ${value}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}