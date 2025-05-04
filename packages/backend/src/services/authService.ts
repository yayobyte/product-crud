import { UnauthorizedError, NotFoundError } from '../errors/httpErrors';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(
  userRepository: UserRepository,
  username: string,
  passwordAttempt: string
): Promise<string> {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = bcrypt.compareSync(
    passwordAttempt,
    user.passwordHash
  );
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not set in environment variables.');
    throw new UnauthorizedError('Authentication configuration error.');
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    secret,
    { expiresIn: '1h' }
  );

  return token;
}
