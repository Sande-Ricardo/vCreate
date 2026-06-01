import { type LabelHTMLAttributes } from 'react';

interface SectionLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Dimmed variant for optional/secondary labels. */
  muted?: boolean;
  /** Mark field as optional — appends "(optional)" in a dimmer tone. */
  optional?: boolean;
  children: React.ReactNode;
}

/**
 * SectionLabel — uses label-caps typography from DESIGN.md.
 *
 * Applied to all form field labels and section headings to provide
 * a "technical, metadata-inspired" feel.
 */
function SectionLabel({
  muted = false,
  optional = false,
  children,
  className = '',
  ...props
}: SectionLabelProps) {
  return (
    <label
      className={[
        'type-label-caps',
        muted
          ? 'text-[var(--color-outline)]'
          : 'text-[var(--color-on-surface-variant)]',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
      {optional ? (
        <span className="ml-1.5 text-[var(--color-outline)] normal-case font-normal tracking-normal text-[10px]">
          (optional)
        </span>
      ) : null}
    </label>
  );
}

export { SectionLabel, type SectionLabelProps };
