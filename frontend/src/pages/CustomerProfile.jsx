import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import profile from "../assets/images/sale.png";

export default function CustomerProfile() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Navbar />
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
        className="fixed top-18 left-0 z-29 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800"
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
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Profile
                </a>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Payment Options
                </a>
              </div>
            </li>
            <li>
              <div className="px-2 mb-4">
                <h3 className="text-xs font-semibold uppercase text-gray-500">
                  My Orders
                </h3>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My WishList
                </a>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Cart
                </a>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <div className="flex flex-1 container mx-auto mt-4 px-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 p-4 sticky top-16 h-full self-start">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Mahmoud Bonga
            </h2>
            <nav className="mt-8">
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase text-gray-500">
                  Manage My Account
                </h3>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Profile
                </a>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Payment Options
                </a>
              </div>
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase text-gray-500">
                  My Orders
                </h3>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My WishList
                </a>
                <a
                  href="#"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out"
                >
                  My Cart
                </a>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <img
                src={profile}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full mr-4"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                Mahmoud Bonga
              </h1>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Edit Your Profile
            </h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    placeholder="First Name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    placeholder="Last Name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800">
                  Password Changes
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-new-password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end items-center space-x-4">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
