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
  const [count, setCount] = useState(1);

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

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-gray-500">
  //       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //       </svg>
  //       Loading product details...
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">
  //       {error}
  //     </div>
  //   );
  // }

  // if (!product) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen text-gray-500">
  //       Product not found.
  //     </div>
  //   );
  // }

  return (
    <div className='md:flex m-8'>
      {/* Product Image */}
      <div className='px-4 md:w-1/2 shadow-xl/30 m-4'>
        <img src={productImage} alt="product image" />
      </div>
      {/* Product details */}
      <div className='p-4 md:w-1/2 shadow-xl/30'>
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
              onClick={() => {
                if(count > 1){
                  setCount(prevCount => prevCount - 1)}}
                }
              className='border-gray-500 border-1 rounded-s-sm p-2 cursor-pointer hover:shadow-xl/20'>
                -
               </div>
              <div className='border-gray-500 border-y py-2 px-8'>{count}</div>
              <div dir="rtl"
              onClick={() => setCount(prevCount => prevCount + 1)}
              className='border-gray-500 border-1 rounded-s-sm p-2 bg-[#083947] 
              text-white cursor-pointer hover:shadow-xl/20'>
                +
                </div>
            </div>
          </div>
          <div className='mx-6 bg-[#083947] text-white px-6 py-2 rounded-sm cursor-pointer hover:shadow-xl/20'>
            <button className='cursor-pointer '>
              Buy Now
            </button>
          </div>
          <div className='border-gray-500 border-1 p-2 mr-4 rounded-sm cursor-pointer hover:shadow-xl/20'>
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
          </div>
        </div>
        <div className='flex border-1 border-gray-500 w-2/3 mt-4 ps-4 items-center rounded-t-md py-4'>
          <div className='pr-4'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <h5>Free Delivery</h5>
            <p className='text-xs'>Enter your postal code for Delivery Availability</p>
          </div>
        </div>
        <div className='flex border-x-1 border-b-1 border-gray-500 w-2/3 mb-4 px-4 items-center rounded-b-md py-4'>
          <div className='pr-4'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <div>
            <h5>Return Delivery</h5>
            <p className='text-xs'>Free 30 Days Delivery Returns Details</p>
          </div>
        </div>
      </div>
    </div>
  )
}
