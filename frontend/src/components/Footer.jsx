import React from 'react';
import Logo from '../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[var(--darker-bg-color)] dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 lg:py-8">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          {/* Copyright Aligned Bottom Left */}
          <div className="self-end">
            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-4 sm:mt-0">
              <p>&copy; {new Date().getFullYear()} DropZ. All rights reserved.</p>
            </span>
          </div>
          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2 text-left">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Start Business</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Sell products on DropZ</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Make money on DropZ</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Get in touch</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Contact us</a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">About DropZ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
