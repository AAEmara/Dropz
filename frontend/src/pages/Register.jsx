import React, { useState } from "react";
import Logo from '../assets/images/logo.png';
import RegisterFooter from "../components/RegisterFooter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Register() {
  const [passHide, setPassHide] = useState(true);
  const [confirmPassHide, setConfirmPassHide] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'customer',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  }

  const handlePassword = () => {
    setPassHide(!passHide);
  };

  const handleConfirmPassword = () => {
    setConfirmPassHide(!confirmPassHide);
  };
  return (
    <div className="bg-[var(--primary-color)] w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col overflow-hidden">
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
        <div className="rounded-2xl shadow-lg p-4  bg-[var(--form-bg-color)] md:w-1/3 flex flex-col items-start">
          <div>
            <h1
              className="text-left text-2xl font-bold tracking-tight text-white"
              style={{ color: "var(--secondary-color)" }}
            >
              Welcome back,
            </h1>
            <h6 className="text-left text-sm tracking-tight text-white">
              Sign up to continue
            </h6>
          </div>

          {/* the form body */}
          <div className="w-full flex justify-center">
            <form
              method="POST"
              className="w-full max-w-md flex flex-col gap-1 pt-2 flex justify-center"
            >
              {/* Container for first and second names */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="first_name">First name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="last_name">Last name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Email, Password */}
              <div>
                <label htmlFor="email">Email address</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label
                  htmlFor="roles"
                  className="block  text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select a role
                </label>
                <select
                  id="roles"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className=" border border-white text-white text-sm rounded-lg focus:outline-none focus:ring-0 block w-full p-2.5"
                >
                  {/* <option defaultValue={'Choose a role'} className="bg-[#39616c96] text-white">Choose a role</option> */}
                  <option value="customer" className="bg-[#39616c96] opacity-25 text-white">Customer</option>
                  <option value="seller" className="bg-[#39616c96] opacity-25 text-white">Seller</option>
                  <option value="shipping_company" className="bg-[#39616c96] opacity-25 text-white">Shipping Company</option>
                </select>
              </div>
              <div>
                <label htmlFor="password">Password</label>

                {/* container which have input field and the icon */}
                <div className="relative flex items-center">
                  <input
                    type={passHide ? "password" : "text"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirm password</label>

                {/* container which have input field and the icon */}
                <div className="relative flex items-center">
                  <input
                    type={confirmPassHide ? "password" : "text"}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-full h-10 border border-white rounded-md bg-transparent mt-1 pl-4 focus:outline-none focus:ring-0"
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
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full flex justify-center rounded-md bg-[var(--secondary-color)] px-4 py-2.5 text-sm font-semibold text-black shadow-sm hover:opacity-90"
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
      <RegisterFooter></RegisterFooter>
    </div>
  );
}
