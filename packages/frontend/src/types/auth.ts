import type { User } from './user';

// Response from login API
export interface LoginResponse {
  token: string;
  user: User;
}

// Auth state for the application
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
