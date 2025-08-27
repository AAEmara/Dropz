import React, { useContext ,useEffect} from 'react';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import SaleSection from '../components/SaleSection';
import { AuthContext } from '../context/auth';
import { useDispatch } from 'react-redux';
import { loadCart } from '../store/slices/cart';

export default function Home() {
  const { isLoggedIn,role } = useContext(AuthContext);
  console.log(isLoggedIn+role);
    const dispatch = useDispatch();
 
  useEffect(() => {
    if (isLoggedIn && role === 'customer') {
      dispatch(loadCart());
    }
  }, [dispatch, isLoggedIn, role]);
  return (
    <div className="bg-white mt-6">
      <ImageSlider />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6">Explore our products</h1>
        <ProductCard productIds={[1, 12, 24, 63]} />
      </div>
      <SaleSection />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6">Best Selling </h1>
        <ProductCard productIds={[31, 14, 54, 89]} />
      </div>
    </div>
  );
}
