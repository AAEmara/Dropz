import React, {  useContext, useState } from 'react';
import Logo from '../assets/images/logo.png';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from "../services/authService";
import { AuthContext } from '../context/auth';
import {useSelector} from 'react-redux';

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCount = useSelector(state=>state.cart.totalCount);

  const { isLoggedIn, role } = useContext(AuthContext);
  const handleAccountClick = () => {
    setIsDropdownOpen(false);
    if(role == "seller"){
      navigate('/seller-profile/seller-user-info');
    } else {
      navigate('/customer-profile');
    }
  };

  const handleLogOut = async () => {
    try {
      await axiosInstance.post("/api/auth/logout/", null, { withCredentials: true });
    } catch (err) {
      console.warn("Logout API failed, clearing client state anyway:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      delete axiosInstance.defaults.headers.common.Authorization;

      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-[var(--primary-color)] text-white relative z-30">
      {/* Top Navbar */}
      <div className="max-w-screen-xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to={'/home'}>
            <img
              src={Logo}
              className="h-20 max-h-20 object-contain"
              alt="Dropz Logo"
            />
          </Link>
        </div>

        {/* Search bar (desktop only) */}
        <div className="hidden md:block  w-full max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full py-2 ps-3 pe-4 text-base text-gray-900 border border-yellow rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white  dark:text-black"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pe-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* language dropdown */}
        <div className='pr-4 py-2 border-r-1'>
          <select name="language" id="language" className='outline-none border-none cursor-pointer '>
            <option value="english" className='text-black hover:bg-gray-500'>English</option>
            <option value="arabic" className='text-black hover:bg-gray-500'>Arabic</option>
          </select>
        </div>
        {/* Desktop Profile Dropdown */}
        <div className="relative z-50 hidden md:block pr-4 border-r-1">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center focus:outline-none cursor-pointer"
          >
           <Link to={'/login'}>{isLoggedIn? 'Profile': 'Login'} </Link><UserCircleIcon className="w-10 h-10 text-white cursor-pointer rounded-full hover:ring-2 ml-2" />
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
        {/* wishlist icon */}
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:shadow-xl/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        {/* cart icon */}
          <div className="relative"> {/* ADDED WRAPPER DIV */}
          <Link to="/cart" className="relative"> {/* ADDED LINK TO CART PAGE */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:shadow-xl/30">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {/* Cart counter badge */}
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalCount}
              </span>
            )}
          </Link>
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
        <Link to="/mens-fashion" className="hover:text-[var(--secondary-color)]">Men’s fashion</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Women’s fashion</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Electronics</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Kids’ fashion</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Home & Lifestyle</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Baby</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Toys & Games</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Sports & Outdoor</Link>
        <Link to="#" className="hover:text-[var(--secondary-color)]">Health & Beauty</Link>
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
            <Link to="/mens-fashion" className="hover:text-[var(--secondary-color)]">Men’s fashion</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Women’s fashion</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Electronics</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Kids’ fashion</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Home & Lifestyle</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Baby</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Toys & Games</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Sports & Outdoor</Link>
            <Link to="#" className="hover:text-[var(--secondary-color)]">Health & Beauty</Link>
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
