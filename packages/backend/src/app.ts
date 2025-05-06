import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createProductRoutes } from './routes/products';
import { createAuthRoutes } from './routes/auth';
import { HttpError } from './errors/httpErrors';
import { ProductRepository } from './repositories/ProductRepository';
import { UserRepository } from './repositories/UserRepository';
import { ProductService } from './services/productService';
import { AuthService } from './services/authService';

export async function createApp(): Promise<express.Application> {
  const app = express();

  // Create repository instances
  const productRepository = new ProductRepository();
  const userRepository = new UserRepository();

  // Initialize repositories as needed
  await productRepository.initialize();
  console.log('Product repository initialized successfully.');

  // Create service instances
  const productService = new ProductService(productRepository);
  const authService = new AuthService(userRepository);

  // Middleware
  app.use(
    cors({
      origin: [
        'https://frontend-bice-eta.vercel.app',
        'https://frontend-yayobyte-yayobytes-projects.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.use(express.json());

  // Create routers by injecting services
  const productRoutes = createProductRoutes(productService);
  const authRoutes = createAuthRoutes(authService);

  // Use routers
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.get('/', rootHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}

function rootHandler(req: Request, res: Response) {
  res.send('Backend server is running!');
}

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error occurred:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    res
      .status(err.status)
      .setHeader('Content-Type', 'application/json')
      .json({ message: err.message });
  } else {
    res
      .status(500)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Internal Server Error' });
  }
}
