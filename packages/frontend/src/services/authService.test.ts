import { vi, describe, it, expect, beforeEach } from 'vitest';
import apiClient from '../api/axiosInstance';
import { login, getMe, logout } from './authService';
import type { LoginCredentials, User } from '../types/user';
import { UserRole } from '../types/roles';

// Mock the apiClient
vi.mock('../api/axiosInstance');

const mockLoginCredentials: LoginCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

const mockLoginResponse = {
  token: 'mock-jwt-token',
};

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.USER,
};

const mockUserProfileResponse = {
  user: mockUser,
};

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      (apiClient.post as vi.Mock).mockResolvedValue({
        data: mockLoginResponse,
      });

      const result = await login(mockLoginCredentials);
      expect(result).toEqual(mockLoginResponse);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        mockLoginCredentials
      );
    });

    it('should throw an error if login fails', async () => {
      const errorMessage = 'Invalid credentials';
      (apiClient.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(login(mockLoginCredentials)).rejects.toThrow(errorMessage);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        mockLoginCredentials
      );
    });
  });

  describe('getMe', () => {
    it('should fetch the current user profile successfully', async () => {
      (apiClient.get as vi.Mock).mockResolvedValue({
        data: mockUserProfileResponse,
      });

      const result = await getMe();
      expect(result).toEqual(mockUserProfileResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('should throw an error if fetching user profile fails', async () => {
      const errorMessage = 'Unauthorized';
      (apiClient.get as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getMe()).rejects.toThrow(errorMessage);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (apiClient.post as vi.Mock).mockResolvedValue({}); // Logout might not return data

      await expect(logout()).resolves.toBeUndefined();
      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should not throw an error even if logout API call fails (as per current service implementation)', async () => {
      const errorMessage = 'Server Error';
      (apiClient.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

      // Current implementation catches and logs the error, but doesn't rethrow for logout
      await expect(logout()).resolves.toBeUndefined();
      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      // Optionally, you could spy on console.error to ensure it was called
      // const consoleErrorSpy = vi.spyOn(console, 'error');
      // await logout();
      // expect(consoleErrorSpy).toHaveBeenCalledWith('AuthService logout error:', expect.any(Error));
    });
  });
});
