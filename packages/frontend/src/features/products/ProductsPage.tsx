import React, { useEffect, useState } from 'react';
import type { Product } from '../../types/product';
import { getAllProducts } from '../../services/productService';
import { ProductCard } from '../../components/ui/ProductCard';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook

export const ProductsPage: React.FC = () => {
  const { isLoading: isAuthLoading } = useAuth(); // Access only isLoading from AuthContext
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ProductsPage rendered. AuthContext isLoading:', isAuthLoading);
    if (isAuthLoading) return; // Wait for AuthContext to finish loading

    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        setIsLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setError(null);
        console.log('Products fetched successfully:', data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthLoading]); // Re-run when AuthContext finishes loading

  if (isAuthLoading || isLoading) {
    console.log('ProductsPage is loading...');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Loading products...</p>
      </div>
    );
  }

  if (error) {
    console.error('ProductsPage error:', error);
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  console.log('Rendering ProductsPage with products:', products);
  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-8"></div>

      {products.length === 0 && !isLoading && (
        <div className="text-center text-gray-500">
          <p>No products found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
