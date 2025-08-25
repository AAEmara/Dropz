import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchProducts } from '../services/productService';

export default function ProductCard({ products: propProducts, productIds }) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
    });

    // If products are not passed as props, fetch them
    if (!propProducts) {
      const getProducts = async () => {
        try {
          setLoading(true);
          const productsData = await fetchProducts();
          // Filter products based on productIds prop or use default IDs
          let filteredProducts;
          if (productIds && productIds.length > 0) {
            filteredProducts = productsData.filter(product =>
              productIds.includes(product.id)
            );
          } else {
            // Default behavior - show products with IDs 1, 2, 3, 4
            filteredProducts = productsData.filter(product =>
              [1, 2, 3, 4].includes(product.id)
            );
          }
          setProducts(filteredProducts);
        } catch (err) {
          setError('Failed to fetch products');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };
      getProducts();
    }
  }, [propProducts, productIds]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white animate-pulse"
            >
              {/* Image placeholder */}
              <div className="w-full h-64 bg-gray-200"></div>

              {/* Content placeholder */}
              <div className="p-4">
                {/* Title + Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>

                {/* Seller */}
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>

                {/* Stars */}
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 bg-gray-300 rounded"
                    ></div>
                  ))}
                  <div className="h-3 w-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }
  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white"
            data-aos="fade-up"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover"
              />

              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  title="Add to wishlist"
                  className="bg-white/90 rounded-full p-2 hover:bg-white cursor-pointer transition-colors"
                >
                  <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
                </button>
                <button
                  title="Add to cart"
                  className="bg-white/90 rounded-full p-2 hover:bg-white cursor-pointer transition-colors"
                >
                  <ShoppingCartIcon className="h-5 w-5 text-gray-600 hover:text-green-500 transition" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Link>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm font-bold text-[var(--primary-color)]">
                  EGP{product.price}
                </p>
              </div>

              <p className="text-xs text-gray-500 mb-3">{product.seller}</p>

              <div className="flex items-center">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                <span className="text-xs text-gray-500 ml-1">(4.8)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
