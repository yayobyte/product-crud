import axios from 'axios';
import { Product } from '../types/product';
import { NotFoundError } from '../errors/httpErrors';

export class ProductRepository {
  private products: Product[] = [];
  private nextId: number = 1;

  constructor() {
    this.initialize()
      .then(() => {
        console.log('Product Repository initialized successfully.');
      })
      .catch((error) => {
        console.error('Error initializing Product Repository:', error);
      });
  }

  async initialize(): Promise<void> {
    try {
      console.log(
        'Initializing Product Repository: Loading initial products...'
      );
      const response = await axios.get<Product[]>(
        'https://fakestoreapi.com/products'
      );
      this.products = response.data;
      this.nextId =
        this.products.length > 0
          ? Math.max(...this.products.map((p) => p.id)) + 1
          : 1;
      console.log(
        `Product Repository initialized with ${this.products.length} products. Next ID: ${this.nextId}`
      );
    } catch (error) {
      const errorMessage =
        'Failed to initialize Product Repository with initial data';
      console.error(errorMessage, error);
      this.products = [];
      this.nextId = 1;
      if (error instanceof Error) {
        throw new Error(`${errorMessage}: ${error.message}`);
      } else {
        throw new Error(`${errorMessage}: Unknown error during initialization`);
      }
    }
  }

  getAll(): Product[] {
    return this.products;
  }

  getById(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(newProductData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...newProductData,
      id: this.nextId++,
    };
    this.products.push(newProduct);
    console.log(
      `Repository: Added product. New count: ${this.products.length}, Next ID: ${this.nextId}`
    );
    return newProduct;
  }

  update(id: number, updatedData: Partial<Omit<Product, 'id'>>): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    const originalProduct = this.products[productIndex];
    const updatedProduct: Product = {
      ...originalProduct,
      ...updatedData,
      id: originalProduct.id, // Ensure ID remains unchanged
    };

    this.products[productIndex] = updatedProduct;
    console.log(`Repository: Updated product with ID: ${id}`);
    return updatedProduct;
  }

  delete(id: number): void {
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    const success = this.products.length < initialLength;

    if (!success) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    console.log(`Repository: Deleted product with ID: ${id}`);
  }
}
