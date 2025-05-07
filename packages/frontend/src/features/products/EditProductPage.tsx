import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductForm } from '../../components/ui/ProductForm';
import { getProductById, updateProduct } from '../../services/productService';
import type { Product } from '../../types/product';

export const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch product ${productId} for editing:`, err);
        setError('Failed to load product details for editing.');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (productData: Omit<Product, 'id' | 'rating'>) => {
    if (!productId) {
      setError('Cannot update product without an ID.');
      return;
    }
    try {
      await updateProduct(productId, productData);
      navigate(`/products/${productId}`);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCancel = () => {
    if (productId) {
      navigate(`/products/${productId}`);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Loading product for editing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
        <p className="text-xl text-red-600">{error}</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">
          Go to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Product not found for editing.</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to={productId ? `/products/${productId}` : '/'}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150 cursor-pointer"
      >
        &larr; Back to Product Details
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <ProductForm
          onSubmit={handleSubmit}
          initialData={product} // Pass current product data to pre-fill the form
          isEditMode={true} // Set form to edit mode
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
