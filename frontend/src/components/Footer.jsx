import React from 'react';

export default function Footer() {
  return (
    <div className="bg-[var(--darker-bg-color)] text-[var(--secondary-color)] text-center py-4 font-semibold">
      <p>&copy; {new Date().getFullYear()} Dropz. All rights reserved.</p>
    </div>
  );
}
