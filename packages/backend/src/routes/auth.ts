import express, { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../services/authService';
import { BadRequestError } from '../errors/httpErrors';
import { UserRepository } from '../repositories/UserRepository';

export function createAuthRoutes(userRepository: UserRepository): Router {
  const router: Router = express.Router();

  const JWT_SECRET = process.env.JWT_SECRET as string;
  const JWT_EXPIRES_IN = '1h';

  router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new BadRequestError('Username and password are required');
      }

      const user = authenticateUser(userRepository, username, password);

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
