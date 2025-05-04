import { UserRole } from './roles';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: UserRole;
      };
    }
  }
}

export {};
