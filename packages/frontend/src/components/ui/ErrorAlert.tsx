import type { ReactNode } from 'react';

/**
 * ErrorAlert component props
 */
export interface ErrorAlertProps {
  /** Error message content */
  message: string | ReactNode;
  /** Optional title for the error */
  title?: string;
  /** Optional callback function for dismissing the error */
  onDismiss?: () => void;
}

/**
 * Error alert component for displaying error messages
 * with consistent styling and an optional dismiss button
 */
export const ErrorAlert = ({ message, title, onDismiss }: ErrorAlertProps) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        {/* Error icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Error content */}
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''} text-red-700`}>
            {message}
          </div>
        </div>

        {/* Dismiss button (if onDismiss provided) */}
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
