import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DailyCollectionByDP = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDailyCollections = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/daily-collection",
        { withCredentials: true }
      );
      setCollections(data.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch daily collections."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyCollections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📊 Daily Collection Status – Delivery Partners
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading today's collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-center text-gray-500">No collections recorded today.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {collections.map((dp) => (
              <div
                key={dp.partnerId}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {dp.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Email:</strong> {dp.email}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Phone:</strong> {dp.phone}
                </p>
                <p className="text-sm text-green-700 font-semibold mb-1">
                  ₹ {dp.totalAmountCollected.toFixed(2)} collected
                </p>
                <p className="text-sm text-gray-500">
                  {dp.orderCount} order{dp.orderCount > 1 ? "s" : ""} delivered
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCollectionByDP;
