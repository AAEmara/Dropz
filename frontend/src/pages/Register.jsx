import React, { useState } from "react";
import Logo from '../assets/images/logo.png';
import RegisterFooter from "../components/RegisterFooter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { isRequired, isValidEmail, isStrongPassword, isMatchingPassword, isValidName } from "../utils/validators";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    role: 'Choose a role',
    pass: '',
    confirmPass: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    secondName: '',
    email: '',
    role: '',
    pass: '',
    confirmPass: ''
  });

  const [passHide, setPassHide] = useState(true);
  const [confirmPassHide, setConfirmPassHide] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
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
      case 'firstName':
      case 'secondName':
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
      case 'role':
        if (value === 'Choose a role') {
          error = 'Please select a role';
        }
        break;
      case 'pass':
        if (!isRequired(value)) {
          error = 'Password is required';
        } else if (!isStrongPassword(value)) {
          error = 'Password must be at least 8 characters with 1 uppercase and 1 number';
        }
        break;
      case 'confirmPass':
        if (!isRequired(value)) {
          error = 'Please confirm your password';
        } else if (!isMatchingPassword(formData.pass, value)) {
          error = 'Passwords do not match';
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
    const newErrors = { ...errors };

    // Validate each field
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
      // Here you would typically send data to your backend
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

          {/* the form body */}
          <div className="w-full flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col gap-1 pt-2"
            >
              {/* Container for first and second names */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className='block text-sm font-medium text-white'>First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="secondName" className='block text-sm font-medium text-white'>Second name</label>
                  <input
                    type="text"
                    id="secondName"
                    name="secondName"
                    value={formData.secondName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                  />
                  {errors.secondName && <p className="text-red-400 text-xs mt-1">{errors.secondName}</p>}
                </div>
              </div>

              {/* Email, Password */}
              <div>
                <label htmlFor="email" className='block text-sm font-medium text-white'>Email address</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label
                  htmlFor="countries"
                  className="block text-sm font-medium text-white"
                >
                  Select a role
                </label>
                <select
                  id="countries"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-white text-white text-sm rounded-lg focus:outline-none focus:ring-0 block w-full p-2.5 bg-[#39616c96]"
                >
                  <option value="Choose a role" className="text-white">Choose a role</option>
                  <option value="Customer" className="text-white">Customer</option>
                  <option value="Seller" className="text-white">Seller</option>
                  <option value="ShippingCompany" className="text-white">Shipping Company</option>
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
              </div>
              <div>
                <label htmlFor="pass" className='block text-sm font-medium text-white'>Password</label>
                <div className="relative flex items-center">
                  <input
                    type={passHide ? "password" : "text"}
                    id="pass"
                    name="pass"
                    value={formData.pass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
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
                {errors.pass && <p className="text-red-400 text-xs mt-1">{errors.pass}</p>}
              </div>
              <div>
                <label htmlFor="confirmPass" className='block text-sm font-medium text-white'>Confirm password</label>
                <div className="relative flex items-center">
                  <input
                    type={confirmPassHide ? "password" : "text"}
                    id="confirmPass"
                    name="confirmPass"
                    value={formData.confirmPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0 mb-2"
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
                {errors.confirmPass && <p className="text-red-400 text-xs mt-1">{errors.confirmPass}</p>}
              </div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-md bg-[var(--secondary-color)] px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:opacity-90 mt-2"
              >
                Register
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