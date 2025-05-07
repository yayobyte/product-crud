import { createContext, useState, useEffect, type ReactNode } from 'react';
import {
  login as authServiceLogin,
  getMe as authServiceGetMe,
} from '../services/authService';
import type { LoginCredentials, User } from '../types/user';

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('authToken')
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        setIsLoading(true);
        try {
          const profileResponse = await authServiceGetMe();
          setUser(profileResponse.user);
          console.log(
            'User profile fetched successfully:',
            profileResponse.user
          );
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const loginResponse = await authServiceLogin(credentials);
      if (loginResponse && loginResponse.token) {
        const newToken = loginResponse.token;
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        console.log('Login successful via AuthContext');
      } else {
        throw new Error('Login failed: No token received from server.');
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem('authToken');
    setToken(null);
    console.log('Logged out via AuthContext');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
