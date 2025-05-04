import express, { Router, Request, Response, NextFunction } from 'express';
import { Product } from '../types/product';
import { BadRequestError } from '../errors/httpErrors';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';
import { UserRole } from '../types/roles';
import { ProductRepository } from '../repositories/ProductRepository';

export function createProductRoutes(
  productRepository: ProductRepository
): Router {
  const router: Router = express.Router();

  // Public routes
  router.get('/', getAllProductsHandler);
  router.get('/:id', getProductByIdHandler);

  // Protected routes
  router.post(
    '/',
    authenticateToken,
    checkRole([UserRole.ADMIN]),
    createProductHandler
  );
  router.put(
    '/:id',
    authenticateToken,
    checkRole([UserRole.ADMIN]),
    updateProductHandler
  );
  router.delete(
    '/:id',
    authenticateToken,
    checkRole([UserRole.ADMIN]),
    deleteProductHandler
  );

  function getAllProductsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const products = productRepository.getAll();
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
      const product = productRepository.getById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  function createProductHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const createdProduct = productRepository.create(newProductData);
      res.status(201).json(createdProduct);
    } catch (error) {
      next(error);
    }
  }

  function updateProductHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      const updatedProduct = productRepository.update(productId, updateData);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  function deleteProductHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productId = parseInt(req.params.id, 10);

      if (isNaN(productId)) {
        throw new BadRequestError('Invalid product ID format');
      }
      productRepository.delete(productId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return router;
}
