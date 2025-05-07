import { Routes, Route } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProductsPage } from './features/products/ProductsPage';
import { MainLayout } from './components/layout/MainLayout'; // Added
import { ThemeProvider } from './theme';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
