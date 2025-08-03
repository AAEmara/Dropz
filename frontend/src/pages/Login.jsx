import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import RegisterFooter from '../components/RegisterFooter';
import {isRequired, isValidEmail, isStrongPassword, isMatchingPassword, isValidName,} from '../utils/validators';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!isRequired(formData.name)) {
      validationErrors.name = 'Name is required';
    } else if (!isValidName(formData.name)) {
      validationErrors.name = 'Name must be at least 3 characters';
    }

    if (!isRequired(formData.email)) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!isRequired(formData.password)) {
      validationErrors.password = 'Password is required';
    } else if (!isStrongPassword(formData.password)) {
      validationErrors.password =
        'Password must be at least 8 characters, include a capital letter and a number';
    }

    if (!isMatchingPassword(formData.password, formData.confirmPassword)) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid! Submitting:', formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-color)]">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-2">
            <img
              alt="Dropz Logo"
              src={Logo}
              className="h-28 w-auto"
            />
          </div>
          <div className="rounded-2xl shadow-lg p-7 mb-5" style={{ backgroundColor: 'var(--form-bg-color)' }}>
            <h1
              className="text-left text-3xl font-bold tracking-tight text-white"
              style={{ color: 'var(--secondary-color)' }}
            >
              Welcome back,
            </h1>
            <h6 className="text-left text-sm tracking-tight text-white mb-4">
              Login to continue
            </h6>
            <form action="#" onSubmit={handleSubmit} method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="mt-1 block w-full rounded-md border border-white px-3 py-2 shadow-sm sm:text-sm text-white bg-transparent focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[var(--secondary-color)] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="mt-1 block w-full rounded-md border border-white px-3 py-2 pr-10 shadow-sm sm:text-sm text-white bg-transparent focus:outline-none"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5 text-white" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5 text-white" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
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
              <a href="#" className="text-[var(--secondary-color)] font-medium hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </main>

      <RegisterFooter />
    </div>
  );
}
