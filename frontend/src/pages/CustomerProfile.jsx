import React, { useEffect, useState } from "react";
import profile from "../assets/images/personIcon.png";
import SideBarMob from "../components/SideBarMob";
import SideBarDisc from "../components/SideBarDisc";
import axiosInstance from "../services/authService";
import { initFlowbite } from 'flowbite';
import { validatePhone, isValidEmail } from '../utils/validators.js';


export default function CustomerProfile() {

  const [emailError, setEmailError] = useState();
  const [error, setError] = useState();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    initFlowbite()
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js";
    script.async = true;
    document.body.appendChild(script);

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/accounts/users/me/");
        const { first_name, last_name, email, phone_number } = response.data;
        setUserData({
          firstName: first_name || "",
          lastName: last_name || "",
          email: email || "",
          phoneNumber: phone_number || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isValidEmail(userData.email)){
        setEmailError("invalid email");
    };
    if(!validatePhone(userData.phoneNumber)){
        setError("invalid phone number");
    };
    if(validatePhone(userData.phoneNumber) && isValidEmail(userData.email)){
        try{
          const updateData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone_number: userData.phoneNumber
          };
          const response = await axiosInstance.patch("/api/accounts/users/me/", updateData);
          console.log("Profile updated successfully:", response.data);
          setError("");
          setEmailError("");
          alert("Changes has been saved successfully");
        }catch (error){
          console.error("Failed to update profile:", error.response || error);
        }
    } ;

  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
        <SideBarMob/>
      <div className="flex flex-1 container mx-auto mt-4 px-4">
        <div className="hidden md:block w-64 sticky top-16 h-full self-start">
          <SideBarDisc/>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <img
                src={profile}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full mr-4 border-4 border-gray-500 shadow-md object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h1>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Edit Your Profile
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="first-name"
                    // placeholder="First Name"
                    onChange={handleChange}
                    value={userData.firstName}
                    className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 
                               shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="last-name"
                    // placeholder="Last Name"
                    onChange={handleChange}
                    value={userData.lastName}
                    className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    // placeholder="Email"
                    value={userData.email}
                    className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {emailError && <p className="text-red-500 pl-2 my-2">{emailError}</p>}
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    onChange={handleChange}
                    // placeholder="Phone Number"
                    value={userData.phoneNumber}
                    className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {error && <p className="text-red-500 my-2">{error}</p>}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800">
                  Password Changes
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      placeholder="Current Password"
                      className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      placeholder="New Password"
                      className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-new-password"
                      placeholder="Confirm New Password"
                      className="mt-1 py-2 ps-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end items-center space-x-4">
                {/* <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                >
                  Cancel
                </button> */}
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

    </div>
  );
}
