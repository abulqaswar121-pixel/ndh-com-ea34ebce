import logo from '@/assets/ndh-master-logo.png';

type BrandMarkProps = {
  className?: string;
  staticMark?: boolean;
  title?: string;
};

const links = [
  'M22 22 L50 50 L78 18',
  'M22 22 L18 76 L50 50 L82 78 L78 18',
  'M22 22 L82 78',
  'M18 76 L78 18',
  'M18 76 L38 42 L62 86 L82 78',
  'M22 22 L38 42 L18 76',
  'M78 18 L68 44 L82 78',
] as const;

const nodes = [
  [22, 22],
  [78, 18],
  [38, 42],
  [68, 44],
  [18, 76],
  [62, 86],
  [82, 78],
] as const;

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