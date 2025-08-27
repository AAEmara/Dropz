import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/authService.js";
import { HeartIcon as SolidHeartIcon, HeartIcon as OutlineHeartIcon, StarIcon } from "@heroicons/react/24/solid";
import { AuthContext } from '../context/auth';
import { useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlist";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(1);
  
  // CORRECTED DESTRUCTURING
  const { role, user } = useContext(AuthContext);
  const currentUserId = user?.user_id;

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const dispatch = useDispatch();

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!product) return;
    const isInWishlist = product.is_in_wishlist;
    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id));
        setProduct(prev => ({ ...prev, is_in_wishlist: false }));
      } else {
        await dispatch(addToWishlist(product.id));
        setProduct(prev => ({ ...prev, is_in_wishlist: true }));
      }
    } catch (error) {
      console.error('Wishlist update failed:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Fetch product details & reviews
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);

        const reviewRes = await axiosInstance.get(`/api/products/${response.data.slug}/reviews`);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Add or Edit review
  const handleSubmitReview = async () => {
    if (!newComment || newRating < 1 || newRating > 5) return;
    setReviewLoading(true);

    try {
      if (editingReviewId) {
        const res = await axiosInstance.put(
          `/api/reviews/${editingReviewId}`,
          { rating: newRating, comment: newComment }
        );
        setReviews(prev => prev.map(r => r.id === editingReviewId ? res.data : r));
      } else {
        const res = await axiosInstance.post(
          `/api/products/${product.slug}/reviews`,
          { rating: newRating, comment: newComment }
        );
        setReviews(prev => [...prev, res.data]);
      }
      setNewComment("");
      setNewRating(5);
      setEditingReviewId(null);
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" | ");
        alert(messages);
      } else {
        alert("Review submission failed.");
      }
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async reviewId => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review.");
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="md:flex m-8">
      {/* Product Image */}
      <div className="px-4 md:w-1/2 shadow-xl/30 m-4 flex justify-center items-center">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="max-w-full max-h-[400px] object-contain rounded"
        />
      </div>

      {/* Product details */}
      <div className="p-4 md:w-1/2 shadow-xl/30">
        <h1 className="text-xl font-bold text-[var(--primary-color)]">{product.title}</h1>
        <div className="flex">
          <div className="flex items-center">
            {Array(5).fill().map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.average_rating.toFixed(1)}) &nbsp;|</span>
          </div>
          <h6 className={`text-sm ${product.stock_quantity > 0 ? "text-[#00FF66]" : "text-red-500"}`}>
            &nbsp;&nbsp;{product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </h6>
        </div>
        <h4 className="text-lg font-semibold text-[var(--primary-color)]">EGP {product.price}</h4>

        {/* Product description */}
        <div className="my-4 shadow-lg p-3 rounded">
          <p className="text-[var(--primary-color)]">{product.description}</p>
        </div>

        {/* Quantity, Buy Now & Wishlist */}
        {role === 'customer' && (
          <div className="flex items-center py-2">
            <div className="flex">
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                disabled={count <= 1 || product.stock_quantity < 1}
                className=" cursor-pointer border border-gray-500 rounded-l-sm p-2 cursor-pointer hover:shadow-xl/30 disabled:opacity-50"
              >
                -
              </button>
              <div className="border-y border-gray-500 py-2 px-8">{count}</div>
              <button
                onClick={() => { if (count < product.stock_quantity) setCount((c) => c + 1) }}
                disabled={count >= product.stock_quantity || product.stock_quantity < 1}
                className=" cursor-pointer border border-gray-500 rounded-r-sm p-2 bg-[#083947] text-white cursor-pointer hover:shadow-xl/30 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="mx-6 bg-[#083947] text-white px-6 py-2 rounded-sm cursor-pointer hover:shadow-xl/30">
              <button className="cursor-pointer">Buy Now</button>
            </div>
            <div className="border border-gray-500 p-2 mr-4 rounded-sm cursor-pointer hover:shadow-xl/30">
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="cursor-pointer transition-transform duration-150"
              >
                {product.is_in_wishlist ? (
                  <SolidHeartIcon
                    className={`h-5 w-5 text-red-500 ${wishlistLoading ? 'scale-90 animate-pulse' : ''}`}
                  />
                ) : (
                  <OutlineHeartIcon
                    className={`h-5 w-5 text-gray-600 hover:text-red-500 ${wishlistLoading ? 'scale-90 animate-pulse' : ''}`}
                  />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-bold text-[var(--primary-color)] mb-2">Reviews ({reviews.length})</h3>

          {reviews.length === 0 && <p className="text-gray-500 mb-2">No reviews yet.</p>}

          {reviews.map(review => (
            <div key={review.id} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-center">
                <div>
                  {Array(review.rating).fill().map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 inline-block" />
                  ))}
                </div>

                {review.user === parseInt(currentUserId) && (
                  <div>
                    <button
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setNewRating(review.rating);
                        setNewComment(review.comment);
                      }}
                      className="cursor-pointer text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className=" cursor-pointer text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</p>
            </div>
          ))}

          {/* Add/Edit Review */}
          {role === "customer" && (
            <div className="mt-4 border p-4 rounded">
              <h4 className="font-bold mb-2">{editingReviewId ? "Edit Your Review" : "Add a Review"}</h4>
              <label className="block mb-1">Rating (1-5):</label>
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setNewRating(prev => Math.max(1, prev - 1))}
                  className="cursor-pointer px-2 py-1 border rounded mr-2"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={newRating}
                  readOnly
                  className="cursor-pointer border p-1 w-20 text-center"
                />
                <button
                  onClick={() => setNewRating(prev => Math.min(5, prev + 1))}
                  className="px-2 py-1 border rounded ml-2"
                >
                  +
                </button>
              </div>
              <label className="block mb-1">Comment:</label>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className=" cursor-pointer bg-[var(--primary-color)] text-white px-4 py-2 rounded"
              >
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}