import { useState } from 'react';
import { LoginForm } from './features/auth/LoginForm';
import './App.css';

function App() {
  // State to toggle between home and login view
  const [showLogin, setShowLogin] = useState(false);

  // Simple home screen
  const HomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Product CRUD Application
      </h1>
      <p className="text-gray-600 mb-6">
        A simple dashboard to manage your products
      </p>
      <button
        onClick={() => setShowLogin(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go to Login
      </button>
    </div>
  );

  return <>{showLogin ? <LoginForm /> : <HomeScreen />}</>;
}

export default App;
