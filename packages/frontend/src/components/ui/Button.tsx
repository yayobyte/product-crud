import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button variants for different use cases
 */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props extending HTML button attributes
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state - shows spinner when true */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Button component with consistent styling, variants, and states
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  // Base styles for all buttons
  const baseStyles =
    'font-medium rounded focus:outline-none transition-colors transition-shadow';

  // Variant-specific styles using new theme colors
  const variantStyles = {
    primary:
      'bg-white text-gray-800 shadow-md hover:bg-gray-50 hover:shadow-lg',
    secondary: 'bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300',
    danger: 'border border-red-500 text-red-600 hover:bg-red-50 shadow-sm',
    outline: 'border border-gray-400 text-gray-700 shadow-sm hover:bg-gray-100',
  };

  // Size-specific styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Disabled or loading state
  const isDisabled = isLoading || disabled;

  // Combined class names
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    isDisabled ? 'opacity-70 cursor-not-allowed' : '',
    className,
  ].join(' ');

  return (
    <button className={buttonClasses} disabled={isDisabled} {...props}>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
