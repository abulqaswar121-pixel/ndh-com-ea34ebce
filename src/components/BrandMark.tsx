import logo from '@/assets/ndh-lockup-transparent.png';
import symbol from '@/assets/ndh-symbol-transparent.png';

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  staticMark?: boolean;
  title?: string;
};

// Both assets are true alpha-transparent PNGs (no baked-in background box) so the
// mark can float directly on any header/footer surface, light or dark.
export function BrandMark({ className = '', compact = false, staticMark = false, title }: BrandMarkProps) {
  const label = title ?? 'Najeeb Digital Hub';

  return (
    <img
      src={compact ? symbol : logo}
      className={`ndh-mark${staticMark ? ' ndh-mark-static' : ''}${className ? ` ${className}` : ''}`}
      alt={title ? label : ''}
      aria-hidden={title ? undefined : true}
      width={compact ? 680 : 1068}
      height={compact ? 310 : 124}
    />
  );
}
