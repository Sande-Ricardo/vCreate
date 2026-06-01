import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-widest',
  md: 'px-6 py-3 text-xs tracking-widest',
  lg: 'px-8 py-4 text-sm tracking-widest',
};

/**
 * Button — Luminous Professional component.
 *
 * primary:   Solid white bg, black text. Glow on hover.
 * secondary: Transparent bg, silver border. Border glows on hover.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-bold uppercase transition-all duration-200',
      'cursor-pointer select-none',
      // Sharp corners — no border-radius
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      isDisabled ? 'opacity-40 cursor-not-allowed' : '',
    ].join(' ');

    const variants: Record<ButtonVariant, string> = {
      primary: [
        'bg-white text-black border-0',
        !isDisabled ? 'hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] hover:bg-[#f0f0f0]' : '',
        'active:scale-[0.98]',
      ].join(' '),
      secondary: [
        'bg-transparent text-white',
        'border border-[rgba(229,229,229,0.3)]',
        !isDisabled
          ? 'hover:border-white hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]'
          : '',
        'active:scale-[0.98]',
      ].join(' '),
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading ? <LoadingSpinner /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="7"
        cy="7"
        r="5"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <path
        d="M7 2A5 5 0 0 1 12 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
