import type { ComponentType, SVGProps } from 'react';

type SectorIcon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * NDH family master symbol — an abstract "hub" mark:
 * two ascending strokes meeting in a peak, with a detached signal dot.
 * Rendered as pure SVG on a rounded gradient tile; scales cleanly at any size.
 */
export function NdhFamilySymbol({
  className = '',
  SectorIcon,
}: {
  className?: string;
  SectorIcon?: SectorIcon;
}) {
  return (
    <span className={`ndh-family-symbol${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className="ndh-family-tile">
        <svg viewBox="0 0 48 48" fill="none" className="ndh-family-mark" role="img" aria-label="NDH symbol">
          <defs>
            <linearGradient id="ndh-mark-grad" x1="8" y1="40" x2="40" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7dd3fc" />
              <stop offset="0.55" stopColor="#e0f2fe" />
              <stop offset="1" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>
          {/* left ascending stroke */}
          <path d="M10 36 L22 14" stroke="url(#ndh-mark-grad)" strokeWidth="5.5" strokeLinecap="round" />
          {/* right descending stroke from the shared peak */}
          <path d="M22 14 L38 36" stroke="url(#ndh-mark-grad)" strokeWidth="5.5" strokeLinecap="round" />
          {/* crossbar linking the two legs */}
          <path d="M16.5 27.5 L31.5 27.5" stroke="url(#ndh-mark-grad)" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
          {/* signal dot above the peak */}
          <circle cx="22" cy="7" r="3" fill="#e0f2fe" />
        </svg>
      </span>
      {SectorIcon ? (
        <span className="ndh-family-sector">
          <SectorIcon />
        </span>
      ) : null}
    </span>
  );
}
