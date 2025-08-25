import React from 'react';
import Logo from '../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[var(--darker-bg-color)] dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 lg:py-8">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          {/* Get in touch Section */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 uppercase dark:text-white">Get in touch</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-1">
                <a href="#" className="hover:underline text-[var(--secondary-color)]">Contact us</a>
              </li>
              <li>
                <a href="/about" className="hover:underline text-[var(--secondary-color)]">About DropZ</a>
              </li>
            </ul>
          </div>
          {/* Copyright Aligned Bottom Left */}
          <div className="self-start">
            <span className="text-lg text-gray-500 dark:text-gray-400 block mt-4 sm:mt-0">
              <p>&copy; {new Date().getFullYear()} DropZ. All rights reserved.</p>
            </span>
          </div>
          {/* Start Business Section */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 uppercase dark:text-white">Start Business</h2>
            <ul className="text-gray-500 dark:text-gray-400 font-medium">
              <li className="mb-1">
                <a href="#" className="hover:underline text-[var(--secondary-color)]">Sell products on DropZ</a>
              </li>
              <li>
                <a href="#" className="hover:underline text-[var(--secondary-color)]">How to make money on DropZ ?</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
