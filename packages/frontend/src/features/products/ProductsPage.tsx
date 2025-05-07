import React from 'react';
import type { Product } from '../../types/product';
import { Button } from '../../components/ui/Button';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <Button variant="primary" size="md">
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            <div className="relative h-64 w-full bg-gray-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2
                className="text-xl font-semibold text-gray-800 mb-2 truncate"
                title={product.title}
              >
                {product.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">{product.category}</p>
              <p className="text-2xl font-bold text-primary-600 mb-4 mt-auto">
                ${product.price.toFixed(2)}
              </p>
              <Button variant="outline" size="sm" fullWidth>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
