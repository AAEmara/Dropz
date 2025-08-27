import React from 'react'
import { Link, useLocation } from 'react-router-dom';

export default function SideBarMob() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
  return (
    <div>
      {/* Mobile Sidebar Toggle Button */}
        <button
            data-drawer-target="drawer-navigation"
            data-drawer-toggle="drawer-navigation"
            aria-controls="drawer-navigation"
            type="button"
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
            <span className="sr-only">Open sidebar</span>
            <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
            </svg>
        </button>
    
        {/* Mobile Sidebar (Flowbite Drawer) */}
        <aside
            id="drawer-navigation" 
            className="fixed top-18 left-0 z-29 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg--gray-800 dark:bg-gray-800"
            tabIndex="-1"
        >
            <button
            type="button"
            data-drawer-hide="drawer-navigation"
            aria-controls="drawer-navigation"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
            <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
            >
                <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
            </svg>
            <span className="sr-only">Close menu</span>
            </button>
            <div className="py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
                <li>
                <div className="px-2 mb-4">
                    <h3 className="text-xs font-semibold uppercase text-gray-500">
                    Manage My Account
                    </h3>
                    <Link
                    to={'/customer-profile'}
                    className={`block py-2 
                        ${isActive('/customer-profile')?
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My Profile
                    </Link>
                    <Link 
                    href="#"
                    className={`block py-2 
                        ${isActive('')? // put the path of the address page provided in the routes in the app.jsx
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My Address
                    </Link>
                    <Link
                    href="#"
                    className={`block py-2 
                        ${isActive('')? // put the path of the payment page provided in the routes in the app.jsx
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My Payment Options
                    </Link>
                </div>
                </li>
                <li>
                <div className="px-2 mb-4">
                    <Link 
                    href="#"
                    className={`block py-2 
                        ${isActive('')? // put the path of the orders page provided in the routes in the app.jsx
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My Orders
                    </Link>
                    <Link
                    to={'/wishlist'}
                    className={`block py-2 
                        ${isActive('')? // put the path of the wishlist page provided in the routes in the app.jsx
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My WishList
                    </Link>
                    <Link
                    to={'/cart'}
                    className={`block py-2 
                        ${isActive('/cart')? 
                        'text-gray-700':
                        'text-white hover:text-blue-600'
                    }  transition duration-150 ease-in-out`}
                    >
                    My Cart
                    </Link>
                </div>
                </li>
            </ul>
            </div>
        </aside>
    </div>
  )
}
