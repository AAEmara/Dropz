import React, { useEffect, useState } from "react";
import axiosInstance from "../services/authService";

export default function SellerAccount() {
  const [formData, setFormData] = useState({
    company_name: "",
    business_license: "",
    tax_id: "",
    verified: false,
    account_status: "",
    created_at: "",
    updated_at: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch seller info
  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/api/accounts/sellers/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching seller info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerInfo();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle PATCH update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.patch("/api/accounts/sellers/me/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData(res.data);
      setSuccess(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating seller info:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccess(false);
  };

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
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Seller Account</h2>
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
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
              required
            />
          </div>

          {/* Business License */}
          <div>
            <label className="block text-sm font-medium mb-1">Business License</label>
            <input
              type="text"
              name="business_license"
              value={formData.business_license || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
              required
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Tax ID</label>
            <input
              type="text"
              name="tax_id"
              value={formData.tax_id || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
              required
            />
          </div>

          {/* Account Status (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Account Status</label>
            <input
              type="text"
              name="account_status"
              value={formData.account_status || ""}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Verified (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Verified
            </label>
            <p
              className={`px-3 py-2 rounded-md text-sm font-semibold w-fit ${formData.verified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {formData.verified ? "Yes" : "No"}
            </p>
          </div>

          {/* Created At (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Created At</label>
            <input
              type="text"
              value={new Date(formData.created_at).toLocaleString()}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Updated At (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-1">Updated At</label>
            <input
              type="text"
              value={new Date(formData.updated_at).toLocaleString()}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
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
