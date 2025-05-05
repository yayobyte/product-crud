// This adapter file helps bridge between traditional Express and serverless

import { createApp } from './app';
import { NextRequest, NextResponse } from '@vercel/node';

let app;

// Initialize the app once
async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}

// Export a handler function for Vercel
export default async function handler(req, res) {
  const app = await getApp();

  // Let Express handle the request
  return app(req, res);
}
