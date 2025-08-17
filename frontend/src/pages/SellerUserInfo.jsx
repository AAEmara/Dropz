import React, { useState, useEffect } from "react";
import { userService } from "../services/userService";

export default function SellerUserInfo() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getCurrentUser();
      setUserData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
      });
    } catch (err) {
      setError("Failed to load user information. Please try again.");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await userService.updateCurrentUser(userData);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error("Error updating user data:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">User Information</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Changes saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors cursor-pointer ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
