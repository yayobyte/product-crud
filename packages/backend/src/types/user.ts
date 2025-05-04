export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: UserRole;
}
