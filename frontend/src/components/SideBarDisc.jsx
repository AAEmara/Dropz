import React from 'react'
import { Link, useLocation } from 'react-router-dom';

export default function SideBarDisc() {

    const location = useLocation();
    // Helper function to determine if a link is active
    const isActive = (path) => location.pathname === path;
  return (
    <div>
      {/* Sidebar */}
        <aside className="hidden md:block w-70 p-4 sticky top-16 h-full self-start">
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* <h2 className="text-xl font-semibold text-gray-800">
                Mahmoud Bonga
                </h2> */}
                <nav className="mt-8">
                <div className="mb-4">
                    <h3 className="text-l font-semibold uppercase text-gray-500">
                    Manage My Account
                    </h3>
                    <div className='ms-4'>
                        <Link
                        to={'/customer-profile'}
                        className={`block py-2 
                            ${isActive('/customer-profile')?
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                        >
                        My Profile
                        </Link>
                        <Link 
                        href="#"
                        className={`block py-2 
                            ${isActive('')? // put the path of the address page provided in the routes in the app.jsx
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                        >
                        My Address
                        </Link>
                        <Link
                        href="#"
                        className={`block py-2 
                            ${isActive('')? // put the path of the payment page provided in the routes in the app.jsx
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                        >
                        My Payment Options
                        </Link>
                    </div>
                </div>
                <div className="mb-4">
                    <Link 
                    href="#"
                    className={`block py-2 
                            ${isActive('')? // put the path of the orders page provided in the routes in the app.jsx
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                        >
                    My Orders
                    </Link>
                    <Link
                    href="#"
                    className={`block py-2 
                            ${isActive('')? // put the path of the wishlist page provided in the routes in the app.jsx
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                        >
                    My WishList
                    </Link>
                    <Link
                    to={'/cart'}
                    className={`block py-2 
                            ${isActive('/cart')?
                                'text-blue-600':
                                'text-gray-700 hover:text-blue-600'
                            } transition duration-150 ease-in-out`}
                    >
                    My Cart
                    </Link>
                </div>
                </nav>
            </div>
        </aside>
    </div>
  )
}
