import Link from 'next/link';
import type {CSSProperties, ReactNode} from 'react';

export function VoxelIsland({
  index,
  label,
  className = '',
}: {
  index: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`voxel-island ${className}`}
      style={
        {
          '--island-x': `${(index % 3) * 50}%`,
          '--island-y': `${Math.floor(index / 3) * 50}%`,
        } as CSSProperties
      }
    />
  );
}
export function LocationPin({number}: {number?: string}) {
  return (
    <span className="world-pin" aria-hidden="true">
      <span>{number || '•'}</span>
    </span>
  );
}
export function WorldButton({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`world-button ${secondary ? 'outline' : ''}`} href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function WorldBrand() {
  return (
    <Link className="world-brand" href="/" aria-label="Data Science Club home">
      <img src="/dsc-logo.svg" alt="" width="48" height="48" />
      <span>
        DATA SCIENCE CLUB<small>USTHB / ALGIERS</small>
      </span>
    </Link>
  );
}
