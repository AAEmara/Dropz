import React from 'react';
import ProductCard from '../components/ProductCard';
import ImageSlider from '../components/ImageSlider';
import SaleSection from '../components/SaleSection';

export default function Home() {
  return (
    <div className="bg-white mt-6">
      <ImageSlider />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6">Explore our products</h1>
        <ProductCard />
      </div>
      <SaleSection />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-6">Best Selling </h1>
        <ProductCard />
      </div>
    </div>
  );
}
