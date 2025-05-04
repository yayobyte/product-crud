import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import { Product } from '../types/product';

const router: Router = express.Router();

let products: Product[] = [];
const FAKE_STORE_URL = 'https://fakestoreapi.com/products';

router.get('/', async (req: Request, res: Response) => {
  try {
    if (products.length === 0) {
      console.log('Fetching initial products from FakeStoreAPI...');
      const response = await axios.get<Product[]>(FAKE_STORE_URL);
      products = response.data;
      console.log(`Fetched ${products.length} products.`);
    }
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

export default router;
