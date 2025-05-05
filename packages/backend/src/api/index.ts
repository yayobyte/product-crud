// This adapter file helps bridge between traditional Express and serverless
import { createApp } from '../app';
import type { Request, Response } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define types that work with both Express and Vercel
type AnyRequest = Request | VercelRequest;
type AnyResponse = Response | VercelResponse;

let app: any;

// Initialize the app once
async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

// Export a handler function for Vercel
export default async function handler(req: AnyRequest, res: AnyResponse) {
  const app = await getApp();

  // Let Express handle the request
  return app(req, res);
}
