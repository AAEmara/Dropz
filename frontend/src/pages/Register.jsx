import React, { useState } from "react";
import Logo from '../assets/images/logo.png';
import RegisterFooter from "../components/RegisterFooter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { isRequired, isValidEmail, isStrongPassword, isMatchingPassword, isValidName } from "../utils/validators";
import axiosInstance from "../services/authService";

export default function Register() {

  const [passHide, setPassHide] = useState(true);
  const [confirmPassHide, setConfirmPassHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'customer',
    password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    password: '',
    confirm_password: '',
    general: '' // For general registration errors
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user types
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
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
      case 'first_name':
      case 'last_name':
        if (!isRequired(value)) {
          error = 'This field is required';
        } else if (!isValidName(value)) {
          error = 'Must contain only letters (3+ characters)';
        }
        break;
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
          error = 'Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character';
        }
        break;
      case 'confirm_password':
        if (!isRequired(value)) {
          error = 'Please confirm your password';
        } else if (!isMatchingPassword(formData.password, value)) {
          error = 'Passwords do not match';
        }
        break;
      case 'role':
        if (!isRequired(value)) {
          error = 'Please select a role';
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

    // Validate each field except confirm_password initially
    Object.keys(formData).forEach(key => {
      if (key !== 'confirm_password' && !validateField(key, formData[key])) {
        isValid = false;
      }
    });

    // Validate confirm_password separately to ensure it matches current password
    if (!validateField('confirm_password', formData.confirm_password)) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any existing general errors
    setErrors(prev => ({ ...prev, general: '' }));

    if (validateForm()) {
      setIsLoading(true);

      try {
        const res = await axiosInstance.post("/api/auth/register/", formData);

        if (res.status === 201) {
          console.log('Registration successful:', res.data);
          // save the role for the routing
          localStorage.setItem("role", formData.role)
          navigate('/login');
        }

      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);

        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Handle different types of error responses
          if (errorData.detail) {
            // Generic error message
            setErrors(prev => ({
              ...prev,
              general: errorData.detail
            }));
          } else if (errorData.non_field_errors) {
            // Non-field errors array
            setErrors(prev => ({
              ...prev,
              general: Array.isArray(errorData.non_field_errors)
                ? errorData.non_field_errors.join(', ')
                : errorData.non_field_errors
            }));
          } else {
            // Handle field-specific errors
            const newErrors = { ...errors };
            let hasFieldErrors = false;

            // Map common backend field names to frontend field names
            const fieldMapping = {
              'first_name': 'first_name',
              'last_name': 'last_name',
              'email': 'email',
              'password': 'password',
              'role': 'role'
            };

            Object.keys(fieldMapping).forEach(backendField => {
              const frontendField = fieldMapping[backendField];
              if (errorData[backendField]) {
                hasFieldErrors = true;
                newErrors[frontendField] = Array.isArray(errorData[backendField])
                  ? errorData[backendField][0]
                  : errorData[backendField];
              }
            });

            // Handle email already exists error specifically
            if (errorData.email && typeof errorData.email === 'string' &&
              errorData.email.toLowerCase().includes('already')) {
              newErrors.email = 'An account with this email already exists';
              hasFieldErrors = true;
            }

            if (hasFieldErrors) {
              setErrors(newErrors);
            } else {
              // Fallback for any other error format
              setErrors(prev => ({
                ...prev,
                general: 'Registration failed. Please check your information and try again.'
              }));
            }
          }
        } else {
          // Network error or other issues
          setErrors(prev => ({
            ...prev,
            general: 'Unable to connect. Please check your internet connection and try again.'
          }));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePassword = () => {
    setPassHide(!passHide);
  };

  const handleConfirmPassword = () => {
    setConfirmPassHide(!confirmPassHide);
  };

  return (
    <div className="bg-[var(--primary-color)] w-full min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-center items-center text-white mx-4 mb-2">
        {/* Logo */}
        <div className="flex justify-center ">
          <img
            src={Logo}
            alt="Dropz Logo"
            className="h-26 w-auto"
          />
        </div>
        {/* container of the big card which hold the form */}
        <div className="rounded-2xl shadow-lg p-8 bg-[var(--form-bg-color)] md:w-1/3 flex flex-col items-start mb-5">
          <div>
            <h1
              className="text-left text-3xl font-bold tracking-tight text-white"
              style={{ color: "var(--secondary-color)" }}
            >
              Join Dropz,
            </h1>
            <h6 className="text-left text-sm tracking-tight text-white">
              Create an account
            </h6>
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="w-full mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* the form body */}
          <div className="w-full flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col gap-1 pt-2"
            >
              {/* Container for first and second names */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="first_name" className='block text-sm font-medium text-white'>First name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isLoading}
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="last_name" className='block text-sm font-medium text-white'>Last name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isLoading}
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>

              {/* Email, Role, Password */}
              <div>
                <label htmlFor="email" className='block text-sm font-medium text-white'>Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={isLoading}
                  className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 disabled:opacity-50"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-white"
                >
                  Select a role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className="border border-white text-white text-sm rounded-lg focus:outline-none focus:ring-0 block w-full p-2.5 bg-[#39616c96] disabled:opacity-50"
                >
                  <option value="customer" className="text-black">Customer</option>
                  <option value="seller" className="text-black">Seller</option>
                  <option value="shipping_company" className="text-black">Shipping Company</option>
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
              </div>
              <div>
                <label htmlFor="password" className='block text-sm font-medium text-white'>Password</label>
                <div className="relative flex items-center">
                  <input
                    type={passHide ? "password" : "text"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isLoading}
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  <span
                    className="absolute right-2 cursor-pointer"
                    onClick={handlePassword}
                  >
                    {passHide ? (
                      <EyeSlashIcon className="h-5 w-5 text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-white" />
                    )}
                  </span>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirm_password" className='block text-sm font-medium text-white'>Confirm password</label>
                <div className="relative flex items-center">
                  <input
                    type={confirmPassHide ? "password" : "text"}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    disabled={isLoading}
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 mb-2 disabled:opacity-50"
                  />
                  <span
                    className="absolute right-2 cursor-pointer"
                    onClick={handleConfirmPassword}
                  >
                    {confirmPassHide ? (
                      <EyeSlashIcon className="h-5 w-5 text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-white" />
                    )}
                  </span>
                </div>
                {errors.confirm_password && <p className="text-red-400 text-xs mt-1">{errors.confirm_password}</p>}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center rounded-md bg-[var(--secondary-color)] px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:opacity-90 mt-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </form>
          </div>
          <p className="mt-5 text-center text-sm text-white w-full flex justify-center">
            Already have an account ?{" "}
            <Link
              to="/login"
              className="text-[var(--secondary-color)] font-medium hover:underline"
            >
              &nbsp;Login
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full">
        <RegisterFooter />
      </div>
    </div>
  );
}
