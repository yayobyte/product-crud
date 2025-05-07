import React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-end items-center h-16">
            <ul className="flex items-center space-x-4 sm:space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-8 container mx-auto px-4 sm:px-6 lg:px-8">
        {' '}
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p>&copy; {currentYear} Product CRUD Application by @yayobyte.</p>
      </footer>
    </div>
  );
};
