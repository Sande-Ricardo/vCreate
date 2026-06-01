import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Number of visible rows (default: 4). */
  rows?: number;
}

/**
 * Textarea — same "Luminous Professional" rules as Input.
 * resize-y only (horizontal resize disabled).
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, rows = 4, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={textareaId}
            className="type-label-caps text-[var(--color-on-surface-variant)]"
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={[
            'w-full bg-transparent px-3 py-2.5',
            'text-sm text-white placeholder:text-[rgba(255,255,255,0.25)]',
            'border transition-all duration-150 outline-none',
            'resize-y',
            error
              ? 'border-[var(--color-error)] focus:shadow-[0_0_0_1px_rgba(255,180,171,0.4)]'
              : [
                  'border-[rgba(229,229,229,0.3)]',
                  'focus:border-white focus:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_8px_rgba(255,255,255,0.08)]',
                ].join(' '),
            className,
          ].join(' ')}
          {...props}
        />

        {error ? (
          <p className="type-label-caps text-[var(--color-error)]" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="type-label-caps text-[var(--color-outline)]">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea, type TextareaProps };
