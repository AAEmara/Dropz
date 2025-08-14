import React, { useEffect, useState } from "react";
import {
  UserIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../api/config";

export default function SellerProfile() {
  const [formData, setFormData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    verified: "",
    company_name: "",
    business_license: "",
    tax_id: "",
    user_phone_number: "",
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch seller data
  useEffect(() => {
    axiosInstance
      .get("/api/accounts/sellers/me")
      .then((res) => {
        console.log("Fetched profile data:", res.data); // Debug log
        // Map the response to match our form structure
        const mappedData = {
          ...res.data,
          verified: res.data.verified || res.data.account_status === "verified" || false,
        };
        setFormData(mappedData);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        alert("Failed to load profile data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Filter out empty/null values and only send fields that have actual values
    const updateData = {};
    
    // Only include fields that have values
    if (formData.user_first_name?.trim()) {
      updateData.user_first_name = formData.user_first_name.trim();
    }
    if (formData.user_last_name?.trim()) {
      updateData.user_last_name = formData.user_last_name.trim();
    }
    if (formData.user_email?.trim()) {
      updateData.user_email = formData.user_email.trim();
    }
    if (formData.company_name?.trim()) {
      updateData.company_name = formData.company_name.trim();
    }
    if (formData.business_license?.trim()) {
      updateData.business_license = formData.business_license.trim();
    }
    if (formData.tax_id?.trim()) {
      updateData.tax_id = formData.tax_id.trim();
    }
    if (formData.user_phone_number?.trim()) {
      updateData.user_phone_number = formData.user_phone_number.trim();
    }

    console.log("Original form data:", formData);
    console.log("Sending update data:", updateData);
    console.log("Update data keys:", Object.keys(updateData));
    console.log("Update data JSON:", JSON.stringify(updateData, null, 2));
    
    axiosInstance
      .patch("/api/accounts/sellers/me", updateData)
      .then((res) => {
        console.log("Update response:", res.data);
        alert("Profile updated successfully!");
        
        // Map the response data properly
        const mappedData = {
          ...res.data,
          verified: res.data.verified || res.data.account_status === "verified" || false,
        };
        setFormData(mappedData);
      })
      .catch((err) => {
        console.error("Full error object:", err);
        console.error("Error response data:", err.response?.data);
        console.error("Error response status:", err.response?.status);
        console.error("Error response headers:", err.response?.headers);
        console.error("Request config:", err.config);
        
        // Log the actual request that was sent
        console.error("Request data that caused error:", err.config?.data);
        
        // More specific error messages based on status
        if (err.response?.status === 400) {
          const errorMsg = err.response?.data?.message || err.response?.data?.error || "Bad Request - Invalid data format";
          alert(`Bad Request: ${errorMsg}`);
          console.error("400 Error details:", err.response.data);
        } else if (err.response?.status === 401) {
          alert("Authentication failed. Please log in again.");
        } else if (err.response?.status === 403) {
          alert("You don't have permission to update this profile.");
        } else if (err.response?.status === 422) {
          alert("Invalid data provided. Please check your inputs.");
          console.error("Validation errors:", err.response.data);
        } else if (err.response?.data?.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert(`Failed to update profile. Status: ${err.response?.status || 'Unknown'}`);
        }
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--darker-bg-color)] shadow-lg p-4 flex flex-col">
        {/* Profile section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <h2 className="mt-3 font-semibold text-lg text-[var(--secondary-color)]">
            <span className="text-white">Welcome Back, </span>{formData.user_first_name}
          </h2>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          <li>
            <a
              href="/seller-dashboard"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--primary-color)]"
            >
              <HomeIcon className="w-5 h-5 text-white" />
              <span className="text-white">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/seller/profile"
              className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--primary-color)] text-white shadow-md"
            >
              <UserIcon className="w-5 h-5" />
              <span>Manage My Account</span>
            </a>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="relative mb-6">
          <a
            href="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-[var(--primary-color)]"
            title="Back to Home"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </a>
          <h1 className="text-2xl font-bold text-[var(--primary-color)] text-center">Seller Profile</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                First Name
              </label>
              <input
                type="text"
                name="user_first_name"
                value={formData.user_first_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="user_last_name"
                value={formData.user_last_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
                required
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Email
              </label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
                required
              />
            </div>

            {/* Business License */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Business License
              </label>
              <input
                type="text"
                name="business_license"
                value={formData.business_license || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
              />
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Tax ID
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="user_phone_number"
                value={formData.user_phone_number || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-white outline-none transition-colors text-white"
              />
            </div>

            {/* Verified Status */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Verified Status
              </label>
              <div className="flex items-center h-10">
                {formData.verified || formData.account_status === "verified" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : formData.account_status === "pending" ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    {formData.account_status || "Unknown"}
                  </span>
                )}
              </div>
            </div>

            {/* Created At (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
                Created At
              </label>
              <input
                type="text"
                value={
                  formData.created_at
                    ? new Date(formData.created_at).toLocaleDateString()
                    : "—"
                }
                disabled
                className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200"
              />
            </div>

            {/* Updated At (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--primary-color)]mb-1">
                Updated At
              </label>
              <input
                type="text"
                value={
                  formData.updated_at
                    ? new Date(formData.updated_at).toLocaleDateString()
                    : "—"
                }
                disabled
                className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200"
              />
            </div>
          </div>

          {/* Save button - now inside the form */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md cursor-pointer" 
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}