import { useId } from 'react';

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
  const gradientId = useId().replace(/:/g, '');
  const label = title ?? 'Najeeb Digital Hub';

  return (
    <svg
      className={`ndh-mark${staticMark ? ' ndh-mark-static' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 100 100"
      role={title ? 'img' : undefined}
      aria-label={title ? label : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{label}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="18%" x2="100%" y2="82%">
          <stop offset="0%" stopColor="var(--ndh-grad-start)" />
          <stop offset="52%" stopColor="var(--ndh-grad-start)" />
          <stop offset="100%" stopColor="var(--ndh-grad-end)" />
        </linearGradient>
      </defs>
      <g className="ndh-mark-links" fill="none" stroke={`url(#${gradientId})`} strokeLinecap="round" strokeLinejoin="round">
        {links.map((path) => <path key={path} d={path} />)}
      </g>
      <g className="ndh-mark-nodes">
        {nodes.map(([cx, cy], index) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.2" style={{ '--node-index': index } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}