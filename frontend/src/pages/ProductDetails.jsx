import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import axiosInstance from '../api/config'
import productImage from '../assets/images/sale.png'
import { HeartIcon } from '@heroicons/react/24/solid';

export default function ProductDetails() {
  const { id } = useParams();
  // console.log(id)
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      setProduct(null)
      try{
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
        console.log(product)
        console.log(id)
      }catch(error){
        console.error('Failed to fetch product details:', error);
        setError('Failed to load product details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails()
  },[id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className='md:flex m-8'>
      {/* Product Image */}
      <div className='px-4 md:w-1/2 shadow-xl/30 m-4'>
        <img src={productImage} alt="product image" />
      </div>
      {/* Product details */}
      <div className='px-4 pt-4 md:w-1/2 shadow-xl/30'>
        <h1 className='text-xl'>this is the title</h1>
        <h6 className='text-sm text-[#00FF66]'>In Stock</h6>
        <h4 className='text-sm'>$199.99</h4>
        {/* product description */}
        <div className='my-4 shadow-lg '> 
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci cupiditate sunt similique quae suscipit eos ipsam. Voluptas laudantium natus, sunt, molestiae minus odio qui aliquid voluptates omnis pariatur, non numquam?
          </p>
        </div>
        {/* product count, payment and love */}
        <div className='flex items-center py-2'>
          <div>
            {/* count container */}
            <div className='flex'>
              <div dir="ltr"
              className='border-gray-500 border-1 rounded-s-sm p-3 cursor-pointer hover:shadow-xl/20'>
                -
               </div>
              <div className='border-gray-500 border-y py-3 px-6'>1</div>
              <div dir="rtl"
              className='border-gray-500 border-1 rounded-s-sm p-3 bg-[#083947] 
              text-white cursor-pointer hover:shadow-xl/20'>
                +
                </div>
            </div>
          </div>
          <div className='mx-6 bg-[#083947] text-white px-6 py-3 rounded-sm cursor-pointer hover:shadow-xl/20'>
            <button className='cursor-pointer '>
              Buy Now
            </button>
          </div>
          <div className='border-gray-500 border-1 p-3 rounded-sm cursor-pointer hover:shadow-xl/20'>
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
          </div>
        </div>
      </div>
    </div>
  )
}
