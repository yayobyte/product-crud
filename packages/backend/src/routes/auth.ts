import express, { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../services/authService';
import { BadRequestError } from '../errors/httpErrors';
import { User } from '../types/user';

const router: Router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '1h';

router.post('/login', loginHandler);

function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError('Username and password are required');
    }

    const user: User = authenticateUser(username, password);

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

export default router;
