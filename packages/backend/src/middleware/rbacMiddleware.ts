import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/roles';
import { ForbiddenError, UnauthorizedError } from '../errors/httpErrors';

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * @param allowedRoles - UserRole type.
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    //Safeguard check (Should be handled by authenticateToken middleware)
    if (!user || !user.role) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError('Insufficient permissions.'));
    }
    next();
  };
};
