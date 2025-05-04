import axios from 'axios';
import { Product } from '../types/product';

let products: Product[] = [];
let nextId = 1;

export const loadInitialProducts = async (): Promise<void> => {
  try {
    console.log('Loading initial products from FakeStoreAPI...');
    const response = await axios.get<Product[]>(
      'https://fakestoreapi.com/products'
    );
    products = response.data;
    nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    console.log(`Loaded ${products.length} products. Next ID: ${nextId}`);
  } catch (error) {
    console.error(
      'Failed to load initial products: restart the server and try again',
      error
    );
    products = [];
    nextId = 1;
  }
};

export const getProducts = (): Product[] => {
  return products;
};

export const addProduct = (newProductData: Omit<Product, 'id'>): Product => {
  const newProduct: Product = {
    ...newProductData,
    id: nextId++,
  };
  products.push(newProduct);
  console.log(
    `Added product. New count: ${products.length}, Next ID: ${nextId}`
  );
  return newProduct;
};

export const updateProduct = (
  id: number,
  updatedData: Partial<Omit<Product, 'id'>>
): Product | undefined => {
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return undefined;
  }

  const originalProduct = products[productIndex];

  const updatedProduct: Product = {
    ...originalProduct,
    ...updatedData,
    id: originalProduct.id,
  };

  products[productIndex] = updatedProduct;
  console.log(`Updated product with ID: ${id}`);
  return updatedProduct;
};
