import React from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <div>
              <Link
                to="/"
                className="text-xl font-semibold text-gray-800 hover:text-primary-700"
              >
                ProductCRUD
              </Link>
            </div>
            <ul className="flex items-center space-x-4 sm:space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  Products
                </Link>
              </li>
              {isLoading ? (
                <li>
                  <span className="text-gray-600 px-3 py-2 text-sm font-medium">
                    Loading...
                  </span>
                </li>
              ) : user ? (
                <>
                  <li>
                    <span className="text-gray-700 px-3 py-2 text-sm font-medium">
                      Hi, {user.username}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-8 pb-8 container mx-auto px-4 sm:px-6 lg:px-8">
        {' '}
        {children}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Product CRUD Application. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
