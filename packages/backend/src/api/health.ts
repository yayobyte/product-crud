// Basic health check endpoint
import { Request, Response } from 'express';

export default function healthHandler(req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
}
