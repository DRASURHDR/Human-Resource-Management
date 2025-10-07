import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  full?: boolean;
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      full = false,
      variant = 'primary',
      className = '',
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-indigo-500',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-indigo-500',
    };
    const widthClass = full ? 'w-full' : '';
    const disabledClass = disabled ? 'cursor-not-allowed opacity-60' : '';
    const combined = [baseClasses, variantClasses[variant], widthClass, disabledClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={combined} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
export type { ButtonProps, ButtonVariant };