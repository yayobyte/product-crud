import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  Mocked,
  afterEach,
} from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from './authService';
import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../types/user';
import { UnauthorizedError, NotFoundError } from '../errors/httpErrors';

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
vi.mock('../repositories/UserRepository');

type MockSign = (
  payload: string | object | Buffer,
  secretOrPrivateKey: jwt.Secret,
  options?: jwt.SignOptions
) => string;

describe('Auth Service', () => {
  let mockUserRepository: Mocked<UserRepository>;
  let authService: AuthService;
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    passwordHash: 'hashedpassword',
    role: UserRole.USER,
  };
  let originalJwtSecret: string | undefined;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as Mocked<UserRepository>;

    vi.resetAllMocks();
    mockUserRepository.findByUsername = vi.fn();

    authService = new AuthService(mockUserRepository);

    vi.mocked(bcrypt.compareSync).mockReturnValue(false); // Default to false
    vi.mocked<MockSign>(jwt.sign).mockReturnValue('mockToken');

    // Store and set JWT_SECRET for tests
    originalJwtSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compareSync).mockReturnValue(true);

      const token = await authService.login('testuser', 'password123');

      expect(token).toBe('mockToken');
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        'testuser'
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'password123',
        'hashedpassword'
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: mockUser.id,
          username: mockUser.username,
          role: mockUser.role,
        },
        'test-secret',
        { expiresIn: '1h' }
      );
    });

    it('should throw UnauthorizedError for invalid password', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compareSync).mockReturnValue(false);

      await expect(
        authService.login('testuser', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        authService.login('testuser', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        'testuser'
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedpassword'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError for non-existent user', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(undefined);

      await expect(
        authService.login('nonexistent', 'password123')
      ).rejects.toThrow(NotFoundError);
      await expect(
        authService.login('nonexistent', 'password123')
      ).rejects.toThrow('User not found');

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        'nonexistent'
      );
      expect(bcrypt.compareSync).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if JWT_SECRET is not set', async () => {
      delete process.env.JWT_SECRET;
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compareSync).mockReturnValue(true);

      await expect(
        authService.login('testuser', 'password123')
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        authService.login('testuser', 'password123')
      ).rejects.toThrow('Authentication configuration error.');

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        'testuser'
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'password123',
        'hashedpassword'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
