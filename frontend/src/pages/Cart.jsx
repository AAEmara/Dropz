import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/authService.js";
import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import { AuthContext } from '../context/auth';
import { useSelector, useDispatch } from 'react-redux';
import QuantityControl from '../components/QuantityControl';
import {
  increaseItemQuantity,
  decreaseItemQuantity,
  removeFromCart
} from '../store/slices/cart';
export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { role } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((cartItem) => cartItem.product.product_id === product.product_id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const cartItemId = cartItem ? cartItem.cart_item_id : null;

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
        console.log("Product data:", response.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
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
    <div className="md:flex m-8">
      {/* Product Image */}
      <div className="px-4 md:w-1/2 shadow-xl/30 m-4">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="w-full max-h-[400px] object-contain rounded"
        />
      </div>

      {/* Product details */}
      <div className="p-4 md:w-1/2 shadow-xl/30">
        <h1 className="text-xl font-bold text-[var(--primary-color)]">{product.title}</h1>
        <div className="flex">
          <div className="flex items-center">
            {Array(5)
              .fill()
              .map((_, i) => (
                <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
              ))}
            <span className="text-xs text-gray-500 ml-1">(4.8) &nbsp;|</span>
          </div>
          <h6
            className={`text-sm ${product.stock_quantity > 0 ? "text-[#00FF66]" : "text-red-500"
              }`}
          >
            &nbsp;&nbsp;{product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </h6>
        </div>
        <h4 className="text-lg font-semibold text-[var(--primary-color)]">EGP {product.price}</h4>

        {/* product description */}
        <div className="my-4 shadow-lg p-3 rounded">
          <p className="text-[var(--primary-color)]">{product.description}</p>
        </div>

        {/* product count, payment and wishlist */}
        <div className="flex items-center py-2">
          {/* Quantity */}
          <div className="flex">
            <QuantityControl
              onAddClick={() => {
                dispatch(increaseItemQuantity(cartItemId));
              }}
              onMinusClick={() => {
                if (quantityInCart > 1) {
                  dispatch(decreaseItemQuantity(cartItemId));
                } else {
                  dispatch(removeFromCart(cartItemId));
                }
              }}
              itemCount={quantityInCart}
              disableMinus={quantityInCart <= 1}
              disablePlus={quantityInCart >= product.stock_quantity}
              errorMessage={
                quantityInCart >= product.stock_quantity
                  ? "Max stock reached"
                  : ""
              }
            />
          </div>

          {role === 'customer' && (
            <>
              <div className="mx-6 bg-[#083947] text-white px-6 py-2 rounded-sm cursor-pointer hover:shadow-xl/30">
                <button className="cursor-pointer">Buy Now</button>
              </div>


              <div className="border border-gray-500 p-2 mr-4 rounded-sm cursor-pointer hover:shadow-xl/30">
                <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
              </div>

            </>

          )
          }
        </div>
        {/* Delivery info */}
        <div className="flex border border-gray-500 w-2/3 mt-4 ps-4 items-center rounded-t-md py-4">
          <div className="pr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <div>
            <h5>Free Delivery</h5>
            <p className="text-xs">Enter your postal code for Delivery Availability</p>
          </div>
        </div>

        <div className="flex border border-gray-500 w-2/3 mb-4 px-4 items-center rounded-b-md py-4">
          <div className="pr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <div>
            <h5>Return Delivery</h5>
            <p className="text-xs">Free 30 Days Delivery Returns Details</p>
          </div>
        </div>
      </div>
    </div>

  );
}