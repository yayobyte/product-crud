// This adapter file helps bridge between traditional Express and serverless
import { createApp } from '../app';
import { Request, Response } from 'express';

let app: any;

// Initialize the app once
async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

// Export a handler function for Vercel
export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  
  // Let Express handle the request
  return app(req, res);
}
