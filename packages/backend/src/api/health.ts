import type { Request, Response } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type AnyRequest = Request | VercelRequest;
type AnyResponse = Response | VercelResponse;

export default function healthHandler(req: AnyRequest, res: AnyResponse) {
  const response = {
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  };

  if ('status' in res && typeof res.status === 'function') {
    // Express style
    res.status(200).json(response);
  } else {
    // Vercel style
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  }
}
