import { HeartIcon as SolidHeartIcon, HeartIcon as OutlineHeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { fetchProducts, getProductById } from '../services/productService';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cart';
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlist";
import { AuthContext } from '../context/auth';

export default function ProductCard({ products: propProducts, productIds }) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [addError, setAddError] = useState(null);
  const [localWishlist, setLocalWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const dispatch = useDispatch();
  const cartError = useSelector(state => state.cart.error);
  const { role } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({ duration: 600, easing: 'ease-in-out', once: true });

    if (!propProducts) {
      const getProducts = async () => {
        try {
          setLoading(true);
          let fetchedProducts = [];

          if (productIds && productIds.length > 0) {
            fetchedProducts = await Promise.all(
              productIds.map((id) => getProductById(id))
            );
          } else {
            const productsData = await fetchProducts();
            fetchedProducts = productsData.slice(0, 4);
          }

          setProducts(fetchedProducts);
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

  const handleWishlistToggle = async (productId) => {
    const isInLocal = localWishlist.includes(productId);

    setLocalWishlist(prev =>
      isInLocal ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      if (isInLocal) {
        await dispatch(removeFromWishlist(productId));
      } else {
        await dispatch(addToWishlist(productId));
      }
    } catch (error) {
      setLocalWishlist(prev =>
        isInLocal ? [...prev, productId] : prev.filter(id => id !== productId)
      );
      console.error('Wishlist update failed:', error);
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));
      setAddError(null);
      await dispatch(addToCart(product.id, 1));
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      setAddError(error.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  useEffect(() => {
    if (addError || cartError) {
      const timer = setTimeout(() => {
        setAddError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [addError, cartError]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white animate-pulse"
            >
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-gray-300 rounded"></div>
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
      {(addError || cartError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {addError || cartError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const inWishlist = localWishlist.includes(product.id);

          return (
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
                  {role === 'customer' && (
                    <>
                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        disabled={wishlistLoading[product.id]}
                        className="bg-white/90 rounded-full p-2 hover:bg-white cursor-pointer transition-colors"
                      >
                        {inWishlist ? (
                          <SolidHeartIcon
                            className={`h-5 w-5 text-red-500 transition-transform duration-150 ${wishlistLoading[product.id] ? 'scale-90 animate-pulse' : ''}`}
                          />
                        ) : (
                          <OutlineHeartIcon
                            className={`h-5 w-5 text-gray-600 hover:text-red-500 transition-transform duration-150 ${wishlistLoading[product.id] ? 'scale-90 animate-pulse' : ''}`}
                          />
                        )}
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        title="Add to cart"
                        className="bg-white/80 rounded-full p-1 hover:bg-white cursor-pointer transition-colors"
                        disabled={addingToCart[product.id]}
                      >
                        {addingToCart[product.id] ? (
                          <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                        ) : (
                          <ShoppingCartIcon className="h-5 w-5 text-gray-600 hover:text-green-500 transition" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link to={`/product-details/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm font-bold text-[var(--primary-color)]">
                    EGP{product.price}
                  </p>
                </div>

                <p className="text-xs text-gray-500 mb-1">{product.seller}</p>

                {/* Stars & review count */}
                <div className="flex items-center space-x-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.average_rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.review_count})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
