import React from 'react'
import success from "../assets/images/check.png";
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 mb-10">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold mr-4">Payment Success</h1>
        <div className="rounded-full">
          <img src={success} alt="success" className="h-28 w-28 object-contain" />
        </div>
      </div>

      <Link to={'/home'} className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-sm">
        Go to home
      </Link>
    </div>
  )
}
