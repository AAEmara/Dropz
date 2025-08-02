import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/images/logo.png';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-2">
          <img
            alt="Dropz Logo"
            src={Logo}
            className="h-28 w-auto"
          />
        </div>
        <div className="rounded-2xl shadow-lg p-7 mb-11" style={{ backgroundColor: 'var(--form-bg-color)' }}>
          <h1
            className="text-left text-3xl font-bold tracking-tight text-white"
            style={{ color: 'var(--secondary-color)' }}
          >
            Welcome back,
          </h1>
          <h6 className="text-left text-sm tracking-tight text-white mb-4">
            Login to continue
          </h6>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-white px-3 py-2 shadow-sm sm:text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <a href="#" className="forget-password">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="mt-1 block w-full rounded-md border border-white px-3 py-2 pr-10 shadow-sm sm:text-sm text-white bg-transparent focus:outline-none"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-white" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-[var(--secondary-color)] px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:opacity-90"
            >
              Login
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-white">
            Don’t have an account?{' '}
            <a href="#" className="register-text">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>


  );
}
export default Login;