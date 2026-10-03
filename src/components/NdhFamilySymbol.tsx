import { useId, type ComponentType, type SVGProps } from 'react';

type SectorIcon = ComponentType<SVGProps<SVGSVGElement>>;

export function NdhFamilySymbol({
  className = '',
  SectorIcon,
}: {
  className?: string;
  SectorIcon?: SectorIcon;
}) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <span className={`ndh-family-symbol${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="22" y1="16" x2="80" y2="86" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--family-symbol-light)" />
            <stop offset=".48" stopColor="var(--family-symbol-mid)" />
            <stop offset="1" stopColor="var(--family-symbol-deep)" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`}>
          <path d="M35 23 45 16Q50 12 56 16L70 26V60L58 51V35Q58 31 55 29L53 28Q50 26 47 28L44 30Q42 32 42 36V42L30 33V30Q30 26 35 23Z" />
          <path d="M18 39Q18 33 23 29L29 25 72 61V26L79 31Q84 35 84 42V65Q84 71 79 75L72 80 28 44V74L22 70Q16 66 16 59V40Z" />
          <path d="M31 55 43 65V69Q43 73 46 75L48 77Q51 79 54 77L57 74Q59 72 59 68V61L70 70V77L55 87Q50 91 45 87L31 77V55Z" />
        </g>
        <path d="M22 35 73 78" stroke="var(--family-symbol-glint)" strokeWidth="1.2" opacity=".6" />
      </svg>
      {SectorIcon ? <span className="ndh-family-sector"><SectorIcon /></span> : null}
    </span>
  );
}