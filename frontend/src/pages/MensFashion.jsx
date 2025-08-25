import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/productService';

const MensFashion = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts({ 'category': 'Men\'s fashion' });
        setProducts(productsData);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white mt-6 mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6 text-center">
          Men's Fashion
        </h1>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 px-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-md animate-pulse"
            >
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white mt-6 mb-8">
      <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6 text-center">
        Men's Fashion
      </h1>
      <ProductCard products={products} />
    </div>
  );
};

export default MensFashion;
