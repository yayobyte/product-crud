import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on navigation
              >
                ProductCRUD
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 p-2 rounded-md"
                aria-label="Open main menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-4 sm:space-x-6">
              <li>
                {user && user.role === UserRole.ADMIN && (
                  <Link
                    to="/products/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
                  >
                    Add Product
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out"
                >
                  Products
                </Link>
              </li>
              {/* Separator was here, can be re-added if desired for desktop */}
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
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg p-4 z-20">
              <ul className="flex flex-col space-y-3">
                <li>
                  <Link
                    to="/"
                    className="block text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out"
                    onClick={toggleMobileMenu} // Close menu on click
                  >
                    Products
                  </Link>
                </li>
                {user && user.role === UserRole.ADMIN && (
                  <li>
                    <Link
                      to="/products/new"
                      className="block text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out"
                      onClick={toggleMobileMenu} // Close menu on click
                    >
                      Add Product
                    </Link>
                  </li>
                )}
                <hr className="my-2" />
                {isLoading ? (
                  <li>
                    <span className="block text-gray-600 px-3 py-2 text-base font-medium">
                      Loading...
                    </span>
                  </li>
                ) : user ? (
                  <>
                    <li>
                      <span className="block text-gray-700 px-3 py-2 text-base font-medium">
                        Hi, {user.username}
                      </span>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout} // handleLogout already closes menu
                        className="w-full text-left text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out cursor-pointer"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="block text-gray-600 hover:text-primary-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out"
                      onClick={toggleMobileMenu} // Close menu on click
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow pt-8 pb-8 container mx-auto px-4 sm:px-6 lg:px-8">
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
