import React from 'react';
import SaleCountdown from './SaleCountDown';
import SaleImage from '../assets/images/sale.png'

export default function SaleSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 px-4">
      <img
        src={SaleImage}
        alt="Sale Banner"
        className="w-full max-w-5xl object-contain rounded-xl shadow-xl"
      />
      <SaleCountdown />
    </div>
  );
}