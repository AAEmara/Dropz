import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  loadCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeFromCart
} from '../store/slices/cart';
import QuantityControl from '../components/QuantityControl';
import SideBarMob from '../components/SideBarMob';
import SideBarDisc from '../components/SideBarDisc';
import { initFlowbite } from 'flowbite';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice, count, error } = useSelector(state => state.cart);

  useEffect(() => {
    initFlowbite();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js";
    script.async = true;
    document.body.appendChild(script);

    dispatch(loadCart());

    return () => {
      document.body.removeChild(script);
    };
  }, [dispatch]);

  const handleCheckout = () => {
    alert('Proceeding to checkout!');
  };

  const handleContinueShopping = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen">
      <SideBarMob />
      <div className="flex flex-1 container mx-auto mt-4 px-4">
        <div className="hidden md:block">
          <SideBarDisc />
        </div>
        <div className="flex-1 md:ml-4">
          <h2 className="text-2xl font-bold mb-4">Cart ({count})</h2>
          {error && (
            <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {items.length === 0 ? (
            <div className="mt-5 text-center md:text-left">
              <h3 className="text-lg text-gray-600">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <table className="table-auto w-full mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-center">Price</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-center">Subtotal</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.cart_item_id} className="border-t">
                        <td className="px-4 py-4">
                          <Link to={`/product-details/${item.product.id}`} className="flex items-center gap-4 hover:opacity-90 transition">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{item.product.seller}</p>
                              {item.status !== 'available' && (
                                <p className="text-sm text-red-500 mt-1">{item.message}</p>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold">
                          EGP {parseFloat(item.product.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <QuantityControl
                              onAddClick={() => dispatch(increaseItemQuantity(item.cart_item_id))}
                              onMinusClick={() => item.quantity > 1 && dispatch(decreaseItemQuantity(item.cart_item_id))}
                              itemCount={item.quantity}
                              disableMinus={item.quantity <= 1}
                              disablePlus={
                                item.quantity >= item.product.stock_quantity || item.status !== 'available'
                              }
                              errorMessage={
                                item.error ||
                                (item.quantity >= item.product.stock_quantity
                                  ? "Max stock reached"
                                  : item.status !== 'available'
                                    ? item.message
                                    : "")
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold">
                          EGP {parseFloat(item.item_subtotal).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                            onClick={() => dispatch(removeFromCart(item.cart_item_id))}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.cart_item_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Link to={`/product/${item.product.id}`} className="flex-1 flex items-start gap-3 hover:opacity-90 transition">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-medium text-sm">{item.product.title}</h3>
                          <p className="text-xs text-gray-500">{item.product.seller}</p>
                          <p className="text-sm font-semibold mt-1">
                            EGP {parseFloat(item.product.price).toFixed(2)}
                          </p>
                          {item.status !== 'available' && (
                            <p className="text-xs text-red-500 mt-1">{item.message}</p>
                          )}
                        </div>
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        onClick={() => dispatch(removeFromCart(item.cart_item_id))}
                      >
                        ×
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quantity:</p>
                        <QuantityControl
                          onAddClick={() => dispatch(increaseItemQuantity(item.cart_item_id))}
                          onMinusClick={() => dispatch(decreaseItemQuantity(item.cart_item_id))}
                          itemCount={item.quantity}
                          disableMinus={item.quantity <= 1}
                          disablePlus={
                            item.quantity >= item.product.stock_quantity || item.status !== 'available'
                          }
                          errorMessage={
                            item.error ||
                            (item.quantity >= item.product.stock_quantity
                              ? "Max stock reached"
                              : item.status !== 'available'
                                ? item.message
                                : "")
                          }
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Subtotal:</p>
                        <p className="text-sm font-semibold">
                          EGP {parseFloat(item.item_subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {items.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Cart Summary</h3>
                <h3 className="text-xl font-semibold">EGP {parseFloat(totalPrice).toFixed(2)}</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition font-medium"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
                <button
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
