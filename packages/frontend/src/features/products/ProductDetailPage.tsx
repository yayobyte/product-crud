import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { getProductById } from '../../services/productService';
import { Rating } from '../../components/ui/Rating';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch product ${productId}:`, err);
        setError('Failed to load product details. Please try again later.');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150 cursor-pointer"
      >
        &larr; Back to Products
      </Link>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
        <div className="md:w-1/2 p-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto object-contain max-h-[500px] rounded"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            {product.category && (
              <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider">
                {product.category}
              </p>
            )}
            {product.rating && (
              <div className="mb-4">
                <Rating
                  rate={product.rating.rate}
                  count={product.rating.count}
                />
              </div>
            )}
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              {product.description}
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary-600 mb-6 text-right">
              ${product.price ? product.price.toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
