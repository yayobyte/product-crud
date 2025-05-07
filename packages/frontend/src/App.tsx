import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProductsPage } from './features/products/ProductsPage';
import { MainLayout } from './components/layout/MainLayout';
import { ThemeProvider } from './theme';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { UserRole } from './types/roles';
import { AddProductPage } from './features/products/AddProductPage';
import { EditProductPage } from './features/products/EditProductPage';
import './App.css';

const AppContent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      console.log(
        'Unauthorized event caught, logging out and redirecting to login.'
      );
      logout();
      navigate('/login', { replace: true });
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate, logout]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <ProtectedRoute role={[UserRole.USER, UserRole.ADMIN]}>
            <MainLayout>
              <ProductDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/new"
        element={
          <ProtectedRoute role={UserRole.ADMIN}>
            <MainLayout>
              <AddProductPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:productId/edit"
        element={
          <ProtectedRoute role={UserRole.ADMIN}>
            <MainLayout>
              <EditProductPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <LoginForm onLoginSuccess={() => navigate('/', { replace: true })} />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
