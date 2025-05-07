import { createContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api/axiosInstance';
import type { LoginCredentials, User } from '../types/user';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          const response = await apiClient.get<{ user: User }>('/auth/me');
          setUser(response.data.user);
          console.log('User profile fetched successfully:', response.data.user);
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
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data && response.data.token) {
        const newToken = response.data.token;
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
