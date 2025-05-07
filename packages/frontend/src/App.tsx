import { Routes, Route } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProductsPage } from './features/products/ProductsPage';
import { MainLayout } from './components/layout/MainLayout';
import { ThemeProvider } from './theme';
import { AuthProvider } from './context/AuthContext';
import { ProductDetailPage } from './features/products/ProductDetailPage';
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
              <MainLayout>
                <ProductDetailPage />
              </MainLayout>
            }
          />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
