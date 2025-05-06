import { useState } from 'react';
import { LoginForm } from './features/auth/LoginForm';
import { Button } from './components/ui/Button';
import { ThemeProvider } from './theme';
import { themeColors } from './theme';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const HomeScreen = () => (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-[${themeColors.gray50}] p-4`}
    >
      <h1 className={`text-3xl font-bold text-[${themeColors.gray900}] mb-6`}>
        Product CRUD Application
      </h1>
      <p className={`text-[${themeColors.gray600}] mb-6`}>
        A simple dashboard to manage your products
      </p>
      <Button onClick={() => setShowLogin(true)} variant="primary" size="md">
        Go to Login
      </Button>
    </div>
  );

  return (
    <ThemeProvider>
      {showLogin ? (
        <LoginForm onBack={() => setShowLogin(false)} />
      ) : (
        <HomeScreen />
      )}
    </ThemeProvider>
  );
}

export default App;
