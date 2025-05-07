import { Routes, Route } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProductsPage } from './features/products/ProductsPage';
import { MainLayout } from './components/layout/MainLayout';
import { ThemeProvider } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import ProtectedRoute from './components/routes/ProtectedRoute'; // Import ProtectedRoute
import { UserRole } from './types/roles'; // Import UserRole
import { AddProductPage } from './features/products/AddProductPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
