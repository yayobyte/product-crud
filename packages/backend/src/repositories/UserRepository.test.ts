import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserRepository } from './UserRepository';
import { User } from '../types/user';
import { UserRole } from '../types/roles';
import bcrypt from 'bcryptjs';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  it('should initialize with mock users', () => {
    const adminUser = userRepository.findByUsername('admin');
    expect(adminUser).toBeDefined();
    expect(adminUser?.username).toBe('admin');
    expect(adminUser?.role).toBe(UserRole.ADMIN);
  });

  it('should find a user by username', () => {
    const usernameToFind = 'user';
    const foundUser = userRepository.findByUsername(usernameToFind);
    expect(foundUser).toBeDefined();
    expect(foundUser?.username).toBe(usernameToFind);
    expect(foundUser?.role).toBe(UserRole.USER);
  });

  it('should return undefined for a non-existent username', () => {
    const foundUser = userRepository.findByUsername('nonexistentuser');
    expect(foundUser).toBeUndefined();
  });

  it('should find a user by ID', () => {
    const userIdToFind = 1; // Assuming admin user has ID 1
    const foundUser = userRepository.findById(userIdToFind);
    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe(userIdToFind);
    expect(foundUser?.username).toBe('admin');
  });

  it('should return undefined for a non-existent ID', () => {
    const foundUser = userRepository.findById(999);
    expect(foundUser).toBeUndefined();
  });

  it('should have hashed passwords for mock users', () => {
    const adminUser = userRepository.findByUsername('admin');
    expect(adminUser).toBeDefined();
    // Check if the stored hash matches the original password using bcrypt
    const isPasswordCorrect = bcrypt.compareSync(
      'password123',
      adminUser!.passwordHash
    );
    expect(isPasswordCorrect).toBe(true);

    const regularUser = userRepository.findByUsername('user');
    expect(regularUser).toBeDefined();
    const isPasswordCorrectUser = bcrypt.compareSync(
      'password456',
      regularUser!.passwordHash
    );
    expect(isPasswordCorrectUser).toBe(true);

    // Check that a wrong password does not match
    const isPasswordIncorrect = bcrypt.compareSync(
      'wrongpassword',
      adminUser!.passwordHash
    );
    expect(isPasswordIncorrect).toBe(false);
  });
});
