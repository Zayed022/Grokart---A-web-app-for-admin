import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/products/get-all-categories"
      );
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        All Categories ({categories.length})
      </h1>

      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-500 text-md">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center justify-center text-center text-gray-800 font-medium text-lg hover:shadow-md transition-all duration-200"
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCategories;
