import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Input — Luminous Professional form field.
 *
 * Default:  Transparent bg, 1px silver border (30% opacity).
 * Focus:    Border becomes Brilliant White + inner backlight glow.
 * Error:    Border turns error-red.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="type-label-caps text-[var(--color-on-surface-variant)]"
          >
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-transparent px-3 py-2.5',
            'text-sm text-white placeholder:text-[rgba(255,255,255,0.25)]',
            'border transition-all duration-150 outline-none',
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

Input.displayName = 'Input';

export { Input, type InputProps };
