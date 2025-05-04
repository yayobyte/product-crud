import express, { Router, Request, Response, NextFunction } from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../data/products';
import { Product } from '../types/product';
import { BadRequestError, NotFoundError } from '../errors/httpErrors';

const router: Router = express.Router();

router.get('/', getAllProductsHandler);
router.get('/:id', getProductByIdHandler);
router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);

function getAllProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

function getProductByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID format');
    }

    const products = getProducts();
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }
  } catch (error) {
    next(error);
  }
}

function createProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, price, description, category, image } = req.body;

    if (
      !title ||
      typeof price !== 'number' ||
      !description ||
      !category ||
      !image
    ) {
      throw new BadRequestError('Missing or invalid required product fields');
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
  } catch (error) {
    next(error);
  }
}

function updateProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseInt(req.params.id, 10);
    const updateData = req.body;

    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID format');
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError('No update data provided');
    }

    if ('id' in updateData) {
      delete updateData.id;
    }

    const updatedProduct = updateProduct(productId, updateData);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

function deleteProductHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      throw new BadRequestError('Invalid product ID format');
    }

    deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export default router;
