import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { createProductRoutes } from './routes/products';
import { createAuthRoutes } from './routes/auth';
import { HttpError } from './errors/httpErrors';
import { ProductRepository } from './repositories/ProductRepository';
import { UserRepository } from './repositories/UserRepository';

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1); // Exit the application immediately
}

const app = express();
const port = process.env.PORT || 3001;

// Create repository instances
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

app.use(cors());
app.use(express.json());

// Create routers by injecting dependencies
const productRoutes = createProductRoutes(productRepository);
const authRoutes = createAuthRoutes(userRepository);

// Use routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.get('/', rootHandler);

app.use(errorHandler);

startServer();

function rootHandler(req: Request, res: Response) {
  res.send('Backend server is running!');
}

function errorHandler(err: Error, req: Request, res: Response) {
  console.error('Error occurred:', err.message);
  if (err instanceof HttpError || (err as any).isHttpError) {
    res.status((err as HttpError).status).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function startServer() {
  try {
    // Initialize repositories (UserRepository currently initializes synchronously in constructor)
    await productRepository.initialize();
    console.log('Product repository initialized successfully.');
    // No async initialize for UserRepository yet, but could be added
    // await userRepository.initialize();
    // console.log('User repository initialized successfully.');

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
