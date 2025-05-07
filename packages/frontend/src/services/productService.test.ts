import { vi, describe, it, expect, beforeEach } from 'vitest';
import apiClient from '../api/axiosInstance';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from './productService';
import type { Product } from '../types/product';

// Mock the apiClient
vi.mock('../api/axiosInstance');

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'Test Description',
  category: 'Test Category',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 10 },
};

const mockNewProductData: Omit<Product, 'id' | 'rating'> = {
  title: 'New Product',
  price: 150,
  description: 'New Description',
  category: 'New Category',
  image: 'new.jpg',
};

describe('productService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts: Product[] = [mockProduct];
      (apiClient.get as vi.Mock).mockResolvedValue({ data: mockProducts });

      const result = await getAllProducts();
      expect(result).toEqual(mockProducts);
      expect(apiClient.get).toHaveBeenCalledWith('/products');
    });

    it('should throw an error if fetching products fails', async () => {
      const errorMessage = 'Network Error';
      (apiClient.get as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getAllProducts()).rejects.toThrow(errorMessage);
      expect(apiClient.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('getProductById', () => {
    it('should fetch a product by ID successfully', async () => {
      (apiClient.get as vi.Mock).mockResolvedValue({ data: mockProduct });

      const result = await getProductById(1);
      expect(result).toEqual(mockProduct);
      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
    });

    it('should throw an error if fetching a product by ID fails', async () => {
      const errorMessage = 'Not Found';
      (apiClient.get as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getProductById(1)).rejects.toThrow(errorMessage);
      expect(apiClient.get).toHaveBeenCalledWith('/products/1');
    });
  });

  describe('addProduct', () => {
    it('should add a new product successfully', async () => {
      const returnedProduct: Product = {
        ...mockNewProductData,
        id: 2,
        rating: { rate: 0, count: 0 },
      };
      (apiClient.post as vi.Mock).mockResolvedValue({ data: returnedProduct });

      const result = await addProduct(mockNewProductData);
      expect(result).toEqual(returnedProduct);
      expect(apiClient.post).toHaveBeenCalledWith(
        '/products',
        mockNewProductData
      );
    });

    it('should throw an error if adding a product fails', async () => {
      const errorMessage = 'Server Error';
      (apiClient.post as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(addProduct(mockNewProductData)).rejects.toThrow(
        errorMessage
      );
      expect(apiClient.post).toHaveBeenCalledWith(
        '/products',
        mockNewProductData
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateData: Partial<Omit<Product, 'id'>> = {
        title: 'Updated Title',
      };
      const updatedProduct: Product = { ...mockProduct, ...updateData };
      (apiClient.put as vi.Mock).mockResolvedValue({ data: updatedProduct });

      const result = await updateProduct(1, updateData);
      expect(result).toEqual(updatedProduct);
      expect(apiClient.put).toHaveBeenCalledWith('/products/1', updateData);
    });

    it('should throw an error if updating a product fails', async () => {
      const updateData: Partial<Omit<Product, 'id'>> = {
        title: 'Updated Title',
      };
      const errorMessage = 'Validation Error';
      (apiClient.put as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(updateProduct(1, updateData)).rejects.toThrow(errorMessage);
      expect(apiClient.put).toHaveBeenCalledWith('/products/1', updateData);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      (apiClient.delete as vi.Mock).mockResolvedValue({ data: undefined }); // Or {} depending on actual API

      await expect(deleteProduct(1)).resolves.toBeUndefined();
      expect(apiClient.delete).toHaveBeenCalledWith('/products/1');
    });

    it('should throw an error if deleting a product fails', async () => {
      const errorMessage = 'Server Error';
      (apiClient.delete as vi.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(deleteProduct(1)).rejects.toThrow(errorMessage);
      expect(apiClient.delete).toHaveBeenCalledWith('/products/1');
    });
  });
});
