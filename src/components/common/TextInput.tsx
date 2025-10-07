import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  requiredMark?: boolean;
  errorMessage?: string;
  hint?: string;
  containerClassName?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      requiredMark = false,
      errorMessage,
      hint,
      id,
      className = '',
      containerClassName = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const describedBy =
      [errorMessage ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

    const baseClasses =
      'block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:ring-indigo-500';
    const borderClasses = errorMessage
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-300 focus:border-indigo-500';
    const disabledClass = rest.disabled ? 'cursor-not-allowed opacity-60' : '';
    const inputClasses = [baseClasses, borderClasses, disabledClass, className].filter(Boolean).join(' ');

    return (
      <div className={['flex flex-col gap-2', containerClassName].filter(Boolean).join(' ')}>
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {requiredMark ? <span className="ml-1 text-red-600">*</span> : null}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy}
          {...rest}
        />
        {hint ? (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
        {errorMessage ? (
          <p id={errorId} className="text-xs text-red-600">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
export type { TextInputProps };