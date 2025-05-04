import express, { Request, Response } from 'express';
import productRoutes from './routes/products'; // Import the product router

const app = express();
const port = process.env.PORT || 3001;

app.use('/api/products', productRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
