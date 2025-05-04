import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/httpErrors';
import { UserRole } from '../types/roles';

interface JwtPayload {
  userId: number;
  role: UserRole;
  iat: number;
  exp: number;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables.');
    return next(new UnauthorizedError('Authentication configuration error.'));
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(new UnauthorizedError('No token provided'));
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    const verifiedPayload = payload as JwtPayload;
    if (
      !verifiedPayload ||
      typeof verifiedPayload !== 'object' ||
      !verifiedPayload.userId ||
      !verifiedPayload.role
    ) {
      return next(new UnauthorizedError('Invalid token payload'));
    }

    req.user = {
      userId: verifiedPayload.userId,
      role: verifiedPayload.role,
    };

    next();
  });
}
