import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../../services/productService';
import type { Product } from '../../types/product';
import { Rating } from '../../components/ui/Rating';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/roles';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again later.');
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {
    if (!productId) {
      alert('Product ID is missing.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        alert('Product deleted successfully.');
        navigate('/');
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-black hover:text-gray-400 transition-colors duration-150"
      >
        &larr; Back to Products
      </Link>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={
                product.image ||
                'https://via.placeholder.com/300x400?text=No+Image'
              }
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // prevent infinite loop if placeholder also fails
                target.src =
                  'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-2 text-sm">
                Category: {product.category}
              </p>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <div className="mb-4">
                <Rating
                  rate={product.rating.rate}
                  count={product.rating.count}
                />
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>
            {isAdmin && (
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/products/${productId}/edit`}
                  className="w-full sm:w-auto text-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150 cursor-pointer"
                >
                  Edit Product
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto text-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 cursor-pointer"
                >
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
