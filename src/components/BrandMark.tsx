import logo from '@/assets/ndh-master-logo.png';
import symbol from '@/assets/ndh-master-symbol.png';

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
      width={720}
      height={760}
    />
  );
}