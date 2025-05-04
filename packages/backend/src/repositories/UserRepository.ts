import { User } from '../types/user';
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

export class UserRepository {
  private users: User[] = [];

  constructor() {
    // Initialize with mock data
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.users = [...mockUsers];
    console.log('User repository initialized with mock data.');
  }

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
