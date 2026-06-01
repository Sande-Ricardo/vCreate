import { type HTMLAttributes } from 'react';

interface IconWrapperProps extends HTMLAttributes<HTMLSpanElement> {
  /** Controls the icon tint: active = Brilliant White, inactive = Glowing Silver. */
  active?: boolean;
  /** Accessible label for the icon (used as aria-label on the wrapper). */
  label: string;
  /** Whether to render as a circular button focal point. */
  asButton?: boolean;
  children: React.ReactNode;
}

/**
 * IconWrapper — SVG icon container following DESIGN.md icon rules.
 *
 * - Outline SVGs only (1px – 1.5px stroke weight, applied by parent SVG).
 * - Inactive: Glowing Silver (#E5E5E5).
 * - Active:   Brilliant White (#FFFFFF).
 * - Circular variant: perfectly round (the only exception to sharp-corners).
 */
function IconWrapper({
  active = false,
  label,
  asButton = false,
  children,
  className = '',
  ...props
}: IconWrapperProps) {
  const colorClass = active
    ? 'text-white'
    : 'text-[var(--color-glowing-silver)]';

  if (asButton) {
    return (
      <span
        role="img"
        aria-label={label}
        className={[
          'inline-flex items-center justify-center',
          'rounded-full w-8 h-8',
          'transition-colors duration-150',
          colorClass,
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={[
        'inline-flex items-center justify-center',
        'transition-colors duration-150',
        colorClass,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}

export { IconWrapper, type IconWrapperProps };
