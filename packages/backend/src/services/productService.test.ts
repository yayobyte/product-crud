import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { ProductService } from './productService';
import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../types/product';
import { NotFoundError } from '../errors/httpErrors';

vi.mock('../repositories/ProductRepository');

const mockProduct1: Product = {
  id: 1,
  title: 'Product 1',
  price: 10,
  description: 'Desc 1',
  category: 'Cat A',
  image: 'img1.jpg',
  rating: { rate: 4, count: 10 },
};
const mockProduct2: Product = {
  id: 2,
  title: 'Product 2',
  price: 20,
  description: 'Desc 2',
  category: 'Cat B',
  image: 'img2.jpg',
  rating: { rate: 3, count: 5 },
};

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: Mocked<ProductRepository>;

  beforeEach(() => {
    // We need to mock the methods since the mock is automatic
    mockRepository = new ProductRepository() as Mocked<ProductRepository>; // Cast to Mocked
    mockRepository.getAll = vi.fn();
    mockRepository.getById = vi.fn();
    mockRepository.create = vi.fn();
    mockRepository.update = vi.fn();
    mockRepository.delete = vi.fn();

    // Create a new service instance with the mock repository
    productService = new ProductService(mockRepository);

    vi.resetAllMocks(); // Reset mocks between tests
  });

  it('getAllProducts should call repository.getAll and return products', () => {
    const mockProducts = [mockProduct1, mockProduct2];
    mockRepository.getAll.mockReturnValue(mockProducts);

    const result = productService.getAllProducts();

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockProducts);
  });

  it('getProductById should call repository.getById and return product if found', () => {
    mockRepository.getById.mockReturnValue(mockProduct1);

    const result = productService.getProductById(1);

    expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockProduct1);
  });

  it('getProductById should re-throw NotFoundError if repository throws it', () => {
    const error = new NotFoundError('Product not found');
    mockRepository.getById.mockImplementation(() => {
      throw error;
    });

    expect(() => productService.getProductById(99)).toThrow(NotFoundError);
    expect(() => productService.getProductById(99)).toThrow(
      'Product not found'
    );
    expect(mockRepository.getById).toHaveBeenCalledWith(99);
  });

  it('createProduct should call repository.create and return the created product', () => {
    const newProductData: Omit<Product, 'id'> = {
      title: 'New Prod',
      price: 30,
      description: 'New Desc',
      category: 'New Cat',
      image: 'new.jpg',
      rating: { rate: 0, count: 0 },
    };
    const createdProduct = { ...newProductData, id: 3 };
    mockRepository.create.mockReturnValue(createdProduct);

    const result = productService.createProduct(newProductData);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(newProductData);
    expect(result).toEqual(createdProduct);
  });

  it('updateProduct should call repository.update and return the updated product', () => {
    const updateData: Partial<Omit<Product, 'id'>> = { price: 15 };
    const updatedProduct = { ...mockProduct1, price: 15 };
    mockRepository.update.mockReturnValue(updatedProduct);

    const result = productService.updateProduct(1, updateData);

    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result).toEqual(updatedProduct);
  });

  it('updateProduct should re-throw NotFoundError if repository throws it', () => {
    const updateData = { price: 15 };
    const error = new NotFoundError('Product not found');
    mockRepository.update.mockImplementation(() => {
      throw error;
    });

    expect(() => productService.updateProduct(99, updateData)).toThrow(
      NotFoundError
    );
    expect(() => productService.updateProduct(99, updateData)).toThrow(
      'Product not found'
    );
    expect(mockRepository.update).toHaveBeenCalledWith(99, updateData);
  });

  it('deleteProduct should call repository.delete', () => {
    mockRepository.delete.mockImplementation(() => {}); // Mock void return

    productService.deleteProduct(1);

    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('deleteProduct should re-throw NotFoundError if repository throws it', () => {
    const error = new NotFoundError('Product not found');
    mockRepository.delete.mockImplementation(() => {
      throw error;
    });

    expect(() => productService.deleteProduct(99)).toThrow(NotFoundError);
    expect(() => productService.deleteProduct(99)).toThrow('Product not found');
    expect(mockRepository.delete).toHaveBeenCalledWith(99);
  });
});
