import express, { Router, Request, Response, NextFunction } from 'express';
import { login } from '../services/authService';
import { BadRequestError } from '../errors/httpErrors';
import { UserRepository } from '../repositories/UserRepository';

export function createAuthRoutes(userRepository: UserRepository): Router {
  const router: Router = express.Router();

  router.post('/login', loginHandler);

  async function loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new BadRequestError('Username and password are required');
      }

      const token = await login(userRepository, username, password);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  return router;
}
