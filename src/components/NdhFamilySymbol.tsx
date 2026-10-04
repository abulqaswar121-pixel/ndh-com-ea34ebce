import type { ComponentType, SVGProps } from 'react';

type SectorIcon = ComponentType<SVGProps<SVGSVGElement>>;

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
        <img src="/ndh-symbol.png" alt="" loading="eager" decoding="async" />
      </span>
      {SectorIcon ? (
        <span className="ndh-family-sector">
          <SectorIcon />
        </span>
      ) : null}
    </span>
  );
}
