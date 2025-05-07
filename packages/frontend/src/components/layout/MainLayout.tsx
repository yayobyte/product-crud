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
      <header className="bg-gray-100 p-4 text-center shadow-md">
        <h1 className="text-3xl font-bold text-primary-700 mb-4">
          Product CRUD Application
        </h1>
        <nav>
          <ul className="list-none p-0 flex justify-center gap-6">
            <li>
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow p-4 container mx-auto">{children}</main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p>&copy; {currentYear} Product CRUD Application by @yayobyte.</p>
      </footer>
    </div>
  );
};
