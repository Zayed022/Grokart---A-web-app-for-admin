import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("https://grokart-2.onrender.com/api/v1/wishList/get-wishlist");
        // Sort latest first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setWishlist(sorted);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("⚠️ Failed to fetch wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📋 All Wishlists
        </h2>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading wishlists...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded-lg text-center">
            No wishlist items found.
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* Image placeholder */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4 text-gray-500">
                  No Image
                </div>
              )}

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.itemName}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {item.description || "No description available."}
              </p>
              
              <p className="text-black-500 text-l font-semibold mb-2 italic">
                {item.phone || "No notes."}
              </p>
              <p className="text-gray-500 text-sm mb-2 italic">
                {item.notes || "No notes."}
              </p>

             {/* Meta */}
<div className="mt-auto text-xs text-gray-400 flex flex-col gap-1">
  <span>Customer: {item.customerId}</span>
  <p className="text-gray-600 text-sm mt-2">
    <span className="font-semibold">Created:</span>{" "}
    {new Date(item.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}
  </p>
</div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetAllWishlist;
