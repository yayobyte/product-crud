import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../types/product';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }

  getProductById(id: number): Product {
    return this.productRepository.getById(id);
  }

  createProduct(productData: Omit<Product, 'id'>): Product {
    return this.productRepository.create(productData);
  }

  updateProduct(
    id: number,
    productData: Partial<Omit<Product, 'id'>>
  ): Product {
    return this.productRepository.update(id, productData);
  }

  deleteProduct(id: number): void {
    this.productRepository.delete(id);
  }
}
