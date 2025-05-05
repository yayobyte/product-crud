import express, { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { BadRequestError } from '../errors/httpErrors';

export function createAuthRoutes(authService: AuthService): Router {
  const router: Router = express.Router();

  router.post('/login', loginHandler);

  async function loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new BadRequestError('Username and password are required');
      }

      const token = await authService.login(username, password);

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  return router;
}
