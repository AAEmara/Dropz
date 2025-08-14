import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from "../api/config";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAccountClick = () => {
    setIsDropdownOpen(false);
    navigate('/seller-profile');
  };

  const handleLogOut = async () => {
    try {
      await axiosInstance.post("/api/auth/logout/");
    } catch (err) {
      console.warn("Logout API failed, clearing client state anyway:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axiosInstance.defaults.headers.common.Authorization;

      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="bg-[var(--primary-color)] text-white relative z-30">
      {/* Top Navbar */}
      <div className="max-w-screen-xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            src={Logo}
            className="h-20 max-h-20 object-contain"
            alt="Dropz Logo"
          />
        </div>

        {/* Search bar (desktop only) */}
        <div className="hidden md:block mx-auto w-full max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-3 ps-11 pe-4 text-base text-gray-900 border border-white rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-[var(--darker-bg-color)] dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Desktop Profile Dropdown */}
        <div className="relative z-50 hidden md:block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <UserCircleIcon className="w-10 h-10 text-white" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border dark:bg-[var(--darker-bg-color)] dark:border-gray-700 z-50">
              <button
                onClick={handleAccountClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
              >
                My account
              </button>
              <button
                onClick={handleLogOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu buttons */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
            <UserCircleIcon className="w-8 h-8 text-white" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="focus:outline-none">
            {isMobileMenuOpen ? <XMarkIcon className="w-8 h-8 text-white" /> : <Bars3Icon className="w-8 h-8 text-white" />}
          </button>
        </div>
      </div>

      {/* Category Links (desktop) */}
      <div className="hidden md:flex justify-center gap-8 bg-slate-900 text-sm font-semibold py-3 px-6 border-b border-white">
        <a href="#" className="hover:text-[var(--secondary-color)]">Men’s fashion</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Women’s fashion</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Electronics</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Kids’ fashion</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Home & Lifestyle</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Baby</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Toys & Games</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Sports & Outdoor</a>
        <a href="#" className="hover:text-[var(--secondary-color)]">Health & Beauty</a>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white px-4 pb-6 space-y-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full mt-4 py-2 px-4 rounded-md bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex flex-col gap-2 text-sm font-semibold">
            <a href="#" className="hover:text-[var(--secondary-color)]">Men’s fashion</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Women’s fashion</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Electronics</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Kids’ fashion</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Home & Lifestyle</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Baby</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Toys & Games</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Sports & Outdoor</a>
            <a href="#" className="hover:text-[var(--secondary-color)]">Health & Beauty</a>
          </div>
        </div>
      )}

      {/* Mobile Profile Dropdown */}
      {isDropdownOpen && (
        <div className="md:hidden bg-[var(--darker-bg-color)] px-4 pt-4 pb-6 space-y-2">
          <button
            onClick={handleAccountClick}
            className="block w-full text-left text-sm text-white hover:text-[var(--secondary-color)]"
          >
            My account
          </button>
          <button
            onClick={handleLogOut}
            className="block w-full text-left text-sm text-white hover:text-[var(--secondary-color)]"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
