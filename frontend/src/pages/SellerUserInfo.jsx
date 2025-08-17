import React from "react";

export default function SellerUserInfo() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[var(--primary-color)]">User Information</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              First Name
            </label>
            <input
              type="text"
              name="user_first_name"
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
              name="user_last_name"
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
              name="user_email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--primary-color)] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="user_phone_number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[var(--primary-color)] outline-none transition-colors text-[var(--primary-color)]"            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
