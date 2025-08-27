import React, { useEffect, useState } from "react";
import axiosInstance from "../services/authService";

export default function ShipperAccount() {
  const [formData, setFormData] = useState({
    company_name: "",
    company_person: "",
    contract_signed: false
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch shipper info
  useEffect(() => {
    const fetchShipperInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/api/accounts/shippers/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching shipper info:", error);
        setError("Failed to load shipper information");
      } finally {
        setLoading(false);
      }
    };
    fetchShipperInfo();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle PATCH update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(false);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axiosInstance.patch("/api/accounts/shippers/me/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData(res.data);
      setSuccess(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating shipper info:", error);
      setError("Failed to update shipper information");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccess(false);
    setError(null);
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
      <h2 className="text-xl font-semibold mb-4 text-[极--primary-color)]">Shipper Account</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Shipper information updated successfully!
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

          {/* Company Person */}
          <div>
            <label className="block text-sm font-medium mb-1">Company Person</label>
            <input
              type="text"
              name="company_person"
              value={formData.company_person || ""}
              onChange={handleInputChange}
              disabled={!editMode}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md text-[var(--primary-color)] ${!editMode
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white focus:border-[var(--primary-color)] outline-none transition-colors"
                }`}
              required
            />
          </div>

          {/* Contract Signed (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Contract Signed
            </label>
            <p
              className={`px-3 py-2 rounded-md text-sm font-semibold w-fit ${formData.contract_signed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {formData.contract_signed ? "Yes" : "No"}
            </p>
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
