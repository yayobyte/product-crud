import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ProductForm } from '../../components/ui/ProductForm';
import { addProduct } from '../../services/productService';
import type { Product } from '../../types/product';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (productData: Omit<Product, 'id' | 'rating'>) => {
    try {
      const newProduct = await addProduct(productData);
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/'); // Navigate to products list page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};
