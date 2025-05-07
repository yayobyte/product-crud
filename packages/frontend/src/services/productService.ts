import apiClient from '../api/axiosInstance';
import type { Product } from '../types/product';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products from backend:', error);
    throw error;
  }
};

export const getProductById = async (id: number | string): Promise<Product> => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id} from backend:`, error);
    throw error;
  }
};

export const addProduct = async (
  productData: Omit<Product, 'id' | 'rating'>
): Promise<Product> => {
  try {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product via backend:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: number | string,
  updateData: Partial<Omit<Product, 'id'>>
): Promise<Product> => {
  try {
    const response = await apiClient.put<Product>(
      `/products/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id} via backend:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product with id ${id} via backend:`, error);
    throw error;
  }
};
