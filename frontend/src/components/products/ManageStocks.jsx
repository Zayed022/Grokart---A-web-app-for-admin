import React, { useState } from "react";
import axios from "axios";

const ManageStock = () => {
  const [subCategory, setSubCategory] = useState("");
  const [stockValue, setStockValue] = useState(0); // Default stock value
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategory.trim()) {
      setError("SubCategory is required");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const { data } = await axios.put(
        `https://grokart-2.onrender.com/api/v1/products/set-stock/${encodeURIComponent(
          subCategory.trim()
        )}`,
        { stock: stockValue } // ✅ Pass dynamic stock value in body
      );

      setResponse(data.message);
      setSubCategory("");
      setStockValue(0); // reset to default
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Set Stock by SubCategory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SubCategory Input */}
        <div>
          <label htmlFor="subCategory" className="block mb-1 font-medium">
            SubCategory Name
          </label>
          <input
            type="text"
            id="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="Enter subCategory name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stock Value Input */}
        <div>
          <label htmlFor="stockValue" className="block mb-1 font-medium">
            Stock Value
          </label>
          <input
            type="number"
            id="stockValue"
            value={stockValue}
            onChange={(e) => setStockValue(Number(e.target.value))}
            min="0"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Processing..." : `Set Stock to ${stockValue}`}
        </button>
      </form>

      {response && (
        <p className="mt-4 text-green-600 text-sm text-center">{response}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default ManageStock;
