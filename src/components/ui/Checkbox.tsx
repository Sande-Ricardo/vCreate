import { type InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={['flex items-center gap-3', className].join(' ')}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className="peer appearance-none w-5 h-5 border border-[rgba(229,229,229,0.3)] bg-transparent focus:outline-none focus:border-white focus:shadow-[0_0_8px_rgba(255,255,255,0.2)] checked:bg-white checked:border-white transition-all cursor-pointer"
            {...props}
          />
          {/* Custom Checkmark SVG */}
          <svg
            className="absolute w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M3 7.5L6 10.5L11 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </div>
        <label htmlFor={checkboxId} className="type-body-md text-[var(--color-on-surface-variant)] cursor-pointer select-none">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps };
