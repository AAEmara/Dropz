import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserIcon,
  HomeIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "My User Info",
      path: "/seller-profile/seller-user-info",
      icon: UserIcon,
    },
    {
      name: "My Seller Account",
      path: "/seller-profile/seller-account",
      icon: ShoppingBagIcon,
    },
    {
      name: "My Dashboard",
      path: "/seller-dashboard",
      icon: HomeIcon,
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile menu button - positioned to not overlap with back button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[var(--primary-color)] text-white rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[var(--darker-bg-color)] shadow-lg p-4 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Profile section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <h2 className="mt-3 font-semibold text-lg text-[var(--secondary-color)]">
            <span className="text-white">Welcome Back</span>
          </h2>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--primary-color)] text-white"
                      : "hover:bg-[var(--primary-color)] text-white"
                  } shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm md:text-base">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="relative mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[var(--primary-color)] cursor-pointer transition-colors hover:underline"
            title="Back to Home"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--primary-color)] text-center mt-4 lg:mt-0">
            Seller Profile
          </h1>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}
