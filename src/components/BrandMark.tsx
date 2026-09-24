import logo from '@/assets/ndh-hub-logo.png';
import symbol from '@/assets/ndh-hub-symbol.png';

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  staticMark?: boolean;
  title?: string;
};

export function BrandMark({ className = '', compact = false, staticMark = false, title }: BrandMarkProps) {
  const label = title ?? 'Najeeb Digital Hub';

  return (
    <img
      src={compact ? symbol : logo}
      className={`ndh-mark${staticMark ? ' ndh-mark-static' : ''}${className ? ` ${className}` : ''}`}
      alt={title ? label : ''}
      aria-hidden={title ? undefined : true}
      width={compact ? 478 : 1024}
      height={compact ? 420 : 1024}
    />
  );
}
