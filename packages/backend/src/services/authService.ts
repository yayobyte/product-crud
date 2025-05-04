import { User } from '../types/user';
import { UnauthorizedError } from '../errors/httpErrors';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';

export function verifyPassword(
  providedPass: string,
  storedHash: string
): boolean {
  return bcrypt.compareSync(providedPass, storedHash);
}

export function authenticateUser(
  userRepository: UserRepository,
  username: string,
  password: string
): User {
  const user = userRepository.findByUsername(username);

  if (!user) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return user;
}
