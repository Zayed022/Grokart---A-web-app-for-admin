import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetDailyEarningsOfShops = () => {
  const [shopId, setShopId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!shopId.trim()) {
      toast.warn("Please enter a Shop ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://grokart-2.onrender.com/api/v1/shop/daily-earnings/${shopId}?date=${date}`,
        { withCredentials: true }
      );
      setEarnings(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch earnings."
      );
      setEarnings(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Daily Earnings of Shop
        </h2>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            placeholder="Enter Shop ID"
            className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-500">Fetching earnings...</p>
        )}

        {!loading && earnings && earnings.success && (
          <div className="bg-gray-50 border rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Shop Daily Earnings (Date: {earnings.date})
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Shop ID:</strong> {earnings.shopId}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Total Orders:</strong> {earnings.totalOrders}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Gross Amount:</strong> ₹{earnings.grossAmount}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Commission:</strong> ₹{earnings.commissionTotal}
            </p>
            <p className="text-sm font-semibold text-green-700">
              <strong>Shop Received:</strong> ₹{earnings.shopReceivedTotal}
            </p>
          </div>
        )}

        {!loading && earnings && !earnings.success && (
          <p className="text-center text-red-500 mt-6">
            {earnings.message || "No earnings data found."}
          </p>
        )}
      </div>
    </div>
  );
};

export default GetDailyEarningsOfShops;
