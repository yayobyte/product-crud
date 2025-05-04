import { User } from '../types/user';
import { UnauthorizedError } from '../errors/httpErrors';
import { UserRole } from '../types/roles';

const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    passwordHash: 'password123',
    role: UserRole.ADMIN,
  },
  {
    id: 2,
    username: 'user',
    passwordHash: 'password456',
    role: UserRole.USER,
  },
];

export function findUserByUsername(username: string): User | undefined {
  return mockUsers.find((user) => user.username === username);
}

export function verifyPassword(
  providedPass: string,
  storedHash: string
): boolean {
  return providedPass === storedHash;
}

export function authenticateUser(username: string, password: string): User {
  const user = findUserByUsername(username);

  if (!user) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid username or password');
  }

  return user;
}
