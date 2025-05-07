import React from 'react';

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      role="alert"
      className="p-4 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      <h2 className="text-lg font-semibold">Oops! Something went wrong.</h2>
      <p className="mt-2">We encountered an error and are unable to proceed.</p>
      <pre className="mt-2 p-2 bg-red-50 text-sm whitespace-pre-wrap">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Try again
      </button>
    </div>
  );
};
