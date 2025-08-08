import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import RegisterFooter from '../components/RegisterFooter';
import axiosInstance from '../api/config';
import { useNavigate, Link } from 'react-router-dom';
import {
  isRequired,
  isValidEmail,
  isStrongPassword
} from '../utils/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!isRequired(value)) {
          error = 'Email is required';
        } else if (!isValidEmail(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!isRequired(value)) {
          error = 'Password is required';
        } else if (!isStrongPassword(value)) {
          error = 'Password must be at least 8 characters with 1 uppercase and 1 number';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const validateForm = () => {
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const res = await axiosInstance.post("/api/auth/login/", formData, {
          withCredentials: true
        });

        if (res.status === 200) {
          console.log('Login successful:', res.data);
          localStorage.setItem('accessToken', res.data.access);
          navigate('/home');
        }
      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--primary-color)]">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-1">
            <img alt="Dropz Logo" src={Logo} className="h-26 w-auto" />
          </div>
          <div className="rounded-2xl shadow-lg p-10 mb-5 bg-[var(--form-bg-color)]">
            <h1 className="text-left text-3xl font-bold tracking-tight text-white" style={{ color: 'var(--secondary-color)' }}>
              Welcome back,
            </h1>
            <h6 className="text-left text-sm tracking-tight text-white mb-4">
              Login to continue
            </h6>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  onBlur={handleBlur}
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
                  <Link to="#" className="text-xs text-[var(--secondary-color)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
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
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--secondary-color)] font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
      <RegisterFooter />
    </div>
  );
}
