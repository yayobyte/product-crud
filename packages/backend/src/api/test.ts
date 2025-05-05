// Simple API handler for testing deployment
import { VercelRequest, VercelResponse } from '@vercel/node';
import healthHandler from './health';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return healthHandler(req, res);
}
