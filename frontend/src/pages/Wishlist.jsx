// src/pages/Wishlist.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadWishlist } from "../store/slices/wishlist";
import WishlistItem from "../components/WishlistItem";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  if (loading) {
<div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
        </div>  
        }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">My Wishlist ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;