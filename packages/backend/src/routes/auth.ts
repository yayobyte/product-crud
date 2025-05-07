import express, { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { BadRequestError, UnauthorizedError } from '../errors/httpErrors';
import { authenticateToken } from '../middleware/authMiddleware';

export function createAuthRoutes(authService: AuthService): Router {
  const router: Router = express.Router();

  router.post('/login', loginHandler);
  router.get('/me', authenticateToken, meHandler);

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

  async function meHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new UnauthorizedError('No user found for token.');
      }

      const user = await authService.getUserProfile(userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      res.json({
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  return router;
}
