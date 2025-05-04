import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/httpErrors';
import { UserRole } from '../types/roles';

const JWT_SECRET = process.env.JWT_SECRET as string;

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

    req.user = {
      userId: verifiedPayload.userId,
      role: verifiedPayload.role,
    };

    next();
  });
}
