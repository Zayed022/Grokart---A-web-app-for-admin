import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DailyEarningsByDP = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/daily-earnings",
        { withCredentials: true }
      );
      setEarnings(data.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch daily earnings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          💼 Daily Earnings – Delivery Partners
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading earnings...</p>
        ) : earnings.length === 0 ? (
          <p className="text-center text-gray-500">No earnings recorded today.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {earnings.map((dp) => (
              <div
                key={dp.partnerId}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dp.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Phone:</strong> {dp.phone}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {dp.email}
                </p>
                <p className="text-sm text-blue-700 font-semibold mb-1">
                  Orders Delivered: {dp.orderCount}
                </p>
                <p className="text-sm text-green-700 font-medium mb-1">
                  Base Earnings: ₹{dp.baseEarnings}
                </p>
                <p className="text-sm text-yellow-600 font-medium mb-1">
                  Incentives: ₹{dp.incentives}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-2">
                  Total: ₹{dp.totalEarnings}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEarningsByDP;
