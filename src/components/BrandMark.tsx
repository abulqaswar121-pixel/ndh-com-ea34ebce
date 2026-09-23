import logo from '@/assets/ndh-master-logo.png';

type BrandMarkProps = {
  className?: string;
  staticMark?: boolean;
  title?: string;
};

export function BrandMark({ className = '', staticMark = false, title }: BrandMarkProps) {
  const label = title ?? 'Najeeb Digital Hub';

  return (
    <img
      src={logo}
      className={`ndh-mark${staticMark ? ' ndh-mark-static' : ''}${className ? ` ${className}` : ''}`}
      alt={title ? label : ''}
      aria-hidden={title ? undefined : true}
      width={720}
      height={760}
    />
  );
}