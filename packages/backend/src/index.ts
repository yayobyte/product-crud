import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import productRoutes from './routes/products';
import { loadInitialProducts } from './data/products';
import { HttpError } from './errors/httpErrors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.get('/', rootHandler);

app.use(errorHandler);

startServer();

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
  if (err instanceof HttpError || (err as any).isHttpError) {
    res.status((err as HttpError).status).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function startServer() {
  await loadInitialProducts();
  console.log('Initial products loaded successfully.');
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
