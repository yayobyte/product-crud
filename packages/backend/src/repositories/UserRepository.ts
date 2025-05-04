import { User } from '../types/user';
import { UserRole } from '../types/roles';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const mockUsersData = [
  {
    id: 1,
    username: 'admin',
    password: 'password123', // temporal
    role: UserRole.ADMIN,
  },
  {
    id: 2,
    username: 'user',
    password: 'password456', // temporal
    role: UserRole.USER,
  },
];

export class UserRepository {
  private users: User[] = [];

  constructor() {
    this.initialize();
  }

  initialize(): void {
    this.users = mockUsersData.map((user) => ({
      ...user,
      passwordHash: bcrypt.hashSync(user.password, saltRounds),
    }));
    console.log('User repository initialized with hashed mock passwords.');
  }

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
