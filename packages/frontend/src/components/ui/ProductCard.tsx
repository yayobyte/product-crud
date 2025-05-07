import React from 'react';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden w-full max-w-xs mx-auto">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4"
        />
      </div>
      {product.category && (
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </p>
        </div>
      )}
    </div>
  );
};
