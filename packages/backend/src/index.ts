import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/products';
import { loadInitialProducts } from './data/products';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

const startServer = async () => {
  await loadInitialProducts();
  console.log('Initial products loaded successfully.');
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

startServer();
