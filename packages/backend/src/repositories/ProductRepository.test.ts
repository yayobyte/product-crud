import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import { ProductRepository } from './ProductRepository';
import { Product } from '../types/product';
import { NotFoundError } from '../errors/httpErrors';

// Mock the axios module
vi.mock('axios');

// Mock console methods
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Sample product data for mocking API response
const mockApiProducts: Product[] = [
  {
    id: 1,
    title: 'Mock Product 1',
    price: 10.99,
    description: 'Desc 1',
    category: 'Category A',
    image: 'img1.jpg',
    rating: { rate: 4.0, count: 10 },
  },
  {
    id: 2,
    title: 'Mock Product 2',
    price: 25.5,
    description: 'Desc 2',
    category: 'Category B',
    image: 'img2.jpg',
    rating: { rate: 3.5, count: 5 },
  },
];

describe('ProductRepository', () => {
  let productRepository: ProductRepository;

  beforeEach(async () => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Mock successful axios get request for initialization
    vi.mocked(axios.get).mockResolvedValue({ data: [...mockApiProducts] });

    productRepository = new ProductRepository();
    // Initialize needs to be awaited as it's async
    await productRepository.initialize();
  });

  afterEach(() => {
    // Ensure mocks are cleared after each test
    vi.restoreAllMocks();
  });

  it('should initialize and load products from API', async () => {
    // Re-initialize within the test to check the mock call
    const repo = new ProductRepository();
    vi.mocked(axios.get).mockResolvedValue({ data: [...mockApiProducts] });
    await repo.initialize();

    expect(axios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    expect(repo.getAll().length).toBe(mockApiProducts.length);
    expect(repo.getById(1)?.title).toBe('Mock Product 1');
  });

  it('should handle error during initialization if API fails', async () => {
    const repo = new ProductRepository();
    const mockError = new Error('API Error');
    vi.mocked(axios.get).mockRejectedValue(mockError);

    // Expect initialize to throw the error from axios
    await expect(repo.initialize()).rejects.toThrow('API Error');
  });

  it('should get all products', () => {
    const products = productRepository.getAll();
    expect(products.length).toBe(mockApiProducts.length);
    expect(products[0].id).toBe(1);
    expect(products[1].id).toBe(2);
  });

  it('should get a product by ID', () => {
    const product = productRepository.getById(1);
    expect(product).toBeDefined();
    expect(product?.id).toBe(1);
    expect(product?.title).toBe('Mock Product 1');
  });

  it('should throw NotFoundError when getting a non-existent product ID', () => {
    expect(() => productRepository.getById(999)).toThrow(NotFoundError);
    expect(() => productRepository.getById(999)).toThrow(
      'Product with ID 999 not found'
    );
  });

  it('should create a new product', () => {
    const initialCount = productRepository.getAll().length;
    const newProductData: Omit<Product, 'id'> = {
      title: 'New Product',
      price: 99.99,
      description: 'A brand new product',
      category: 'New Category',
      image: 'new.jpg',
      rating: { rate: 0, count: 0 },
    };

    const createdProduct = productRepository.create(newProductData);

    expect(createdProduct.id).toBeDefined();
    expect(createdProduct.title).toBe(newProductData.title);
    expect(createdProduct.price).toBe(newProductData.price);
    expect(productRepository.getAll().length).toBe(initialCount + 1);
    // Check if the new product can be retrieved
    const retrievedProduct = productRepository.getById(createdProduct.id);
    expect(retrievedProduct).toEqual(createdProduct);
  });

  it('should update an existing product', () => {
    const productIdToUpdate = 1;
    const updateData = {
      title: 'Updated Product 1',
      price: 12.99,
    };

    const updatedProduct = productRepository.update(
      productIdToUpdate,
      updateData
    );

    expect(updatedProduct.id).toBe(productIdToUpdate);
    expect(updatedProduct.title).toBe(updateData.title);
    expect(updatedProduct.price).toBe(updateData.price);
    // Check that other fields remain unchanged
    expect(updatedProduct.description).toBe('Desc 1');

    // Verify the update in the repository
    const retrievedProduct = productRepository.getById(productIdToUpdate);
    expect(retrievedProduct?.title).toBe(updateData.title);
  });

  it('should throw NotFoundError when updating a non-existent product ID', () => {
    const updateData = { title: 'Does not matter' };
    expect(() => productRepository.update(999, updateData)).toThrow(
      NotFoundError
    );
    expect(() => productRepository.update(999, updateData)).toThrow(
      'Product with ID 999 not found'
    );
  });

  it('should delete an existing product', () => {
    const productIdToDelete = 1;
    const initialCount = productRepository.getAll().length;

    productRepository.delete(productIdToDelete);

    expect(productRepository.getAll().length).toBe(initialCount - 1);
    // Verify the product is actually gone
    expect(() => productRepository.getById(productIdToDelete)).toThrow(
      NotFoundError
    );
  });

  it('should throw NotFoundError when deleting a non-existent product ID', () => {
    expect(() => productRepository.delete(999)).toThrow(NotFoundError);
    expect(() => productRepository.delete(999)).toThrow(
      'Product with ID 999 not found'
    );
  });
});
