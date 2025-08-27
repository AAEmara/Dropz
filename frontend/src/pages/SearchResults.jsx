import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosInstance from "../services/authService";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (searchQuery, pageNum) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/api/products/?search=${searchQuery}&page=${pageNum}`
      );

      setResults(response.data.results || response.data);
      setCount(response.data.count || 0);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query, page);
    }
  }, [query, page]);

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-[var(--primary-color)] rounded-lg text-white cursor-pointer"
        >
          ← Back to Home
        </button>
      </div>

      {/* Header */}
      <h2 className="text-xl font-bold mb-4">
        Search Results for: <span className="text-[var(--primary-color)]">{query}</span>
      </h2>

      {/* Error */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Loader */}
      {loading && <p className="text-center text-gray-500">Searching...</p>}

      {/* Results */}
      {!loading && results.length > 0 && <ProductCard products={results} />}

      {/* Empty */}
      {!loading && query && results.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}

      {/* Pagination */}
      {count > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg shadow ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white hover:bg-opacity-90"
              }`}
          >
            Previous
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={results.length === 0}
            className={`px-4 py-2 rounded-lg shadow ${results.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white hover:bg-opacity-90"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
