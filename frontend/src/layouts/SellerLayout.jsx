import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserIcon,
  HomeIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--darker-bg-color)] shadow-lg p-4 flex flex-col">
        {/* Profile section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <h2 className="mt-3 font-semibold text-lg text-[var(--secondary-color)]">
            <span className="text-white">Welcome Back,</span>
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
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--primary-color)] text-white"
                      : "hover:bg-[var(--primary-color)] text-white"
                  } shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="relative mb-6">
          <button
            onClick={() => navigate("/")}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-[var(--primary-color)] cursor-pointer transition-colors hover:underline"
            title="Back to Home"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-[var(--primary-color)] text-center">Seller Profile</h1>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}
