import type { ComponentType, SVGProps } from 'react';

type SectorIcon = ComponentType<SVGProps<SVGSVGElement>>;

/** The N, D and H share strokes in one NDH family monogram. */
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
        <svg viewBox="0 0 56 56" fill="none" className="ndh-family-mark" focusable="false">
          <path className="ndh-family-n" d="M8 42V14L24 42V14" />
          <path className="ndh-family-d" d="M24 14H30C41 14 48 20 48 28S41 42 30 42H24" />
          <path className="ndh-family-h" d="M24 28H47" />
          <path className="ndh-family-h" d="M47 14V42" />
        </svg>
      </span>
      {SectorIcon ? (
        <span className="ndh-family-sector">
          <SectorIcon strokeWidth={2} />
        </span>
      ) : null}
    </span>
  );
}
