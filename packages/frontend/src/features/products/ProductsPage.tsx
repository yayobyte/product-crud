import React from 'react';
import type { Product } from '../../types/product';
import { Button } from '../../components/ui/Button';
import { ProductCard } from '../../components/ui/ProductCard';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Classic Cotton T-Shirt',
    price: 25.99,
    description:
      'A comfortable and durable t-shirt made from 100% premium cotton. Perfect for everyday wear.',
    category: "Men's Clothing",
    image:
      'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.5, count: 150 },
  },
  {
    id: 2,
    title: 'Slim Fit Denim Jeans',
    price: 59.99,
    description:
      'Modern slim fit jeans crafted from high-quality denim with a slight stretch for comfort.',
    category: "Men's Clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.2, count: 250 },
  },
  {
    id: 3,
    title: 'Wireless Bluetooth Headphones',
    price: 89.99,
    description:
      'High-fidelity wireless headphones with noise-cancellation and long battery life.',
    category: 'Electronics',
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: { rate: 4.8, count: 500 },
  },
  {
    id: 4,
    title: 'Elegant Leather Backpack',
    price: 120.0,
    description:
      'A stylish and spacious leather backpack, perfect for work or travel. Features multiple compartments.',
    category: 'Accessories',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 4.6, count: 120 },
  },
];

export const ProductsPage: React.FC = () => {
  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <Button variant="primary" size="md">
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
