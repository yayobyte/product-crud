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
          className="w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        {product.category && (
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
            {product.category}
          </p>
        )}
        <h2
          className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors duration-300"
          title={product.title}
        >
          {product.title}
        </h2>
        {product.description && (
          <p className="text-sm text-gray-700 mb-3 flex-grow line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-xl font-bold text-primary-700 text-right">
            ${product.price ? product.price.toFixed(2) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
