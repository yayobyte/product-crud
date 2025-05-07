import apiClient from '../api/axiosInstance';
import type { LoginCredentials, User } from '../types/user';

interface LoginResponse {
  token: string;
}

interface UserProfileResponse {
  user: User;
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('AuthService login error:', error);
    throw error; // Rethrow to be handled by the calling component or context
  }
};

export const getMe = async (): Promise<UserProfileResponse> => {
  try {
    console.log('AuthService: Initiating getMe API call to /auth/me');
    const response = await apiClient.get<UserProfileResponse>('/auth/me');
    console.log('AuthService: Received response from /auth/me:', response.data);
    return response.data;
  } catch (error) {
    console.error('AuthService getMe error:', error);
    throw error; // Rethrow to be handled by the calling component or context
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('AuthService logout error:', error);
    // Decide if this error needs to be propagated
  }
};
