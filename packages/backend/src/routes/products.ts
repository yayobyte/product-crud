import express, { Router, Request, Response, RequestHandler } from 'express';
import { getProducts, addProduct, updateProduct } from '../data/products';
import { Product } from '../types/product';

const router: Router = express.Router();

router.get('/', getAllProductsHandler);
router.get('/:id', getProductByIdHandler);
router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);

function getAllProductsHandler(req: Request, res: Response) {
  try {
    const products = getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
}

function getProductByIdHandler(req: Request, res: Response) {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    res.status(400).json({ message: 'Invalid product ID format' });
    return;
  }

  const products = getProducts();
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}

function createProductHandler(req: Request, res: Response) {
  const { title, price, description, category, image } = req.body;

  if (
    !title ||
    typeof price !== 'number' ||
    !description ||
    !category ||
    !image
  ) {
    res
      .status(400)
      .json({ message: 'Missing or invalid required product fields' });
    return;
  }

  const newProductData: Omit<Product, 'id'> = {
    title,
    price,
    description,
    category,
    image,
    rating: { rate: 0, count: 0 },
  };

  const createdProduct = addProduct(newProductData);
  res.status(201).json(createdProduct);
}

function updateProductHandler(req: Request, res: Response) {
  const productId = parseInt(req.params.id, 10);
  const updateData = req.body;

  if (isNaN(productId)) {
    res.status(400).json({ message: 'Invalid product ID format' });
    return;
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ message: 'No update data provided' });
    return;
  }

  if (updateData.id) {
    //id should not be updated
    delete updateData.id;
  }

  const updatedProduct = updateProduct(productId, updateData);

  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}

export default router;
