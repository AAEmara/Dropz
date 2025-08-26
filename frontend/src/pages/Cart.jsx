import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../store/slices/cart';
import QuantityControl from '../components/QuantityControl';
import SideBarMob from '../components/SideBarMob';
import SideBarDisc from '../components/SideBarDisc';
import { initFlowbite } from 'flowbite';

export default function Cart() {
  useEffect(() => {
    initFlowbite();
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const total = cartItems.reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0);

  const handleCheckout = () => {
    alert('Proceeding to checkout!');
  };

  const handleContinueShopping = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen">
      <SideBarMob />
      <div className="flex flex-1 container mx-auto mt-4 px-4 ">
        <div className="hidden md:block">
          <SideBarDisc />
        </div>
        <div className="flex-1 md:ml-4">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cartItems.length === 0 ? (
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
                      <th className="px-4 py-2 text-center">Product</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-4">
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition flex-shrink-0 cursor-pointer"
                              onClick={() => dispatch(removeFromCart(item.id))}
                            >
                              x
                            </button>
                            <img src={item.imageSrc} alt={item.name} className="w-20 h-20 object-cover rounded flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <QuantityControl
                            onAddClick={() => dispatch(incrementQuantity(item.id))}
                            onMinusClick={() => dispatch(decrementQuantity(item.id))}
                            itemCount={item.quantity}
                          />
                        </td>
                        <td className="px-4 py-2 font-semibold">£{Math.floor(parseFloat(item.price) * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-4 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={item.imageSrc} alt={item.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-600">£{item.price} each</p>
                      </div>
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        x
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <QuantityControl
                        onAddClick={() => dispatch(incrementQuantity(item.id))}
                        onMinusClick={() => dispatch(decrementQuantity(item.id))}
                        itemCount={item.quantity}
                      />
                      <span className="font-semibold">£{Math.floor(parseFloat(item.price) * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {cartItems.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-auto">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Total:</h4>
                <h4 className="text-lg font-semibold">£{total.toFixed(0)}</h4>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
                <button 
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}