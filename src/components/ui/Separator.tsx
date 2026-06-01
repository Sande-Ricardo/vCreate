/**
 * Separator — "Glowing Separator" from DESIGN.md.
 *
 * A 1px horizontal line that fades to transparent at both edges
 * via a radial gradient (rgba(255,255,255,0.5) → transparent).
 */
function Separator({ className = '' }: { className?: string }) {
  return (
    <hr
      aria-hidden="true"
      className={['separator-glow border-none', className].join(' ')}
    />
  );
}

export { Separator };
