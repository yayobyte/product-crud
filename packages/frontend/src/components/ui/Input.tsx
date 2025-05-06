import { type InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input component props extending HTML input attributes
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message - shows red border and error text */
  error?: string;
  /** Full width input */
  fullWidth?: boolean;
  /** Helper text displayed below input */
  helperText?: string;
}

/**
 * Input component with consistent styling, label, and error handling
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = true,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID for accessibility
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Determine input class names based on state
    const inputClasses = [
      'shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      error ? 'border-red-500' : 'border-gray-300',
      className,
    ].join(' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-red-500 text-xs mt-1">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-gray-500 text-xs mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
