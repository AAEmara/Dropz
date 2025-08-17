import React from "react";

export default function SellerAccount() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">Seller Account Details</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Business License
            </label>
            <input
              type="text"
              name="company_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Tax ID
            </label>
            <input
              type="text"
              name="tax_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Verified Status
            </label>
            <div className="flex items-center h-10">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                Verified
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Created At
            </label>
            <input
              type="text"
              value="2024-01-15"
              disabled
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Updated At
            </label>
            <input
              type="text"
              value="2024-01-20"
              disabled
              className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors cursor-pointer"
          >
            Update Account
          </button>
        </div>
      </form>
    </div>
  );
}
