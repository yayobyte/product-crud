import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createProductRoutes } from './routes/products';
import { createAuthRoutes } from './routes/auth';
import { HttpError } from './errors/httpErrors';
import { ProductRepository } from './repositories/ProductRepository';
import { UserRepository } from './repositories/UserRepository';
import { ProductService } from './services/productService';
import { AuthService } from './services/authService';

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1); // Exit the application immediately
}

const app = express();
const port = process.env.PORT || 3001;

// Create repository instances
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

// Create service instances
const productService = new ProductService(productRepository);
const authService = new AuthService(userRepository);

// Create routers by injecting services
const productRoutes = createProductRoutes(productService);
const authRoutes = createAuthRoutes(authService);

app.use(cors());
app.use(express.json());

// Use routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.get('/', rootHandler);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

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
