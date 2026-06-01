import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, renders the top-right geometric "node" (4px white square). */
  withNode?: boolean;
  children: React.ReactNode;
}

/**
 * Card — "Transparency Cut" style.
 *
 * No solid background. Ultra-thin 1px border (double-stroke effect via
 * box-shadow inner highlight). Optional top-right 4px white square node
 * emphasizing the "technical construction" motif from DESIGN.md.
 */
function Card({ withNode = true, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'relative w-full',
        // Transparency Cut: no bg, 1px outer border, 1px inner highlight
        'border border-[rgba(229,229,229,0.2)]',
        'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
        // Subtle backdrop blur
        'bg-[rgba(255,255,255,0.02)] backdrop-blur-[10px]',
        'p-6',
        className,
      ].join(' ')}
      {...props}
    >
      {/* Top-right geometric node — 4px white square */}
      {withNode ? (
        <span
          aria-hidden="true"
          className="absolute top-0 right-0 w-1 h-1 bg-white"
          style={{ transform: 'translate(50%, -50%)' }}
        />
      ) : null}
      {children}
    </div>
  );
}

export { Card, type CardProps };
