// Simple API handler for testing deployment
import { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from './health';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Use the health check handler directly
  return healthHandler(req, res);
}
