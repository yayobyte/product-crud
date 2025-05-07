import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/roles';

interface ProtectedRouteProps {
  children: React.ReactElement;
  role?: UserRole | UserRole[]; // Allow a single role or an array of roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    if (!rolesArray.includes(user.role)) {
      // Redirect to a fallback page (e.g., home) if role doesn't match
      // Or to an unauthorized page
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
