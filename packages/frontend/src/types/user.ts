import { UserRole } from './roles';

// This matches the User interface from backend but omits passwordHash
export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
