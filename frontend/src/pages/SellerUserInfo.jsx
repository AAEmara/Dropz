import React, { useEffect, useState } from "react";
import axiosInstance from "../api/config";

export default function SellerUserInfo() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get("/api/accounts/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
        });
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update user info via PATCH
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication required. Please log in.");
        setUpdating(false);
        return;
      }

      const response = await axiosInstance.patch(
        "/api/accounts/users/me/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        phone_number: response.data.phone_number || "",
      });

      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
      } else if (err.response?.status === 403) {
        setError("Access denied. Please ensure you have proper permissions.");
      } else {
        setError(err.response?.data || err.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccess(false);
    setError(null);
  };

  // ✅ UI States
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  if (error && !editMode && !success) {
    return (
      <div className="text-red-500 p-4">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">
        User Information
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          User information updated successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
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
              value={formData.last_name}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
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
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
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
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              Edit Information
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updating}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
