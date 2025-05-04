import { UserRole } from './roles';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: UserRole;
}
