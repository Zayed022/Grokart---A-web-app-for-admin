import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetCompOrdersByDP = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warn("Please enter a delivery partner name, email or ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://grokart-2.onrender.com/api/v1/delivery/completed-by-partner?query=${query}`,
        { withCredentials: true }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Completed Orders by Delivery Partner
        </h2>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Delivery Partner ID, Name, or Email"
            className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-500">Fetching completed orders...</p>
        )}

        {!loading && orders.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>User:</strong> {order.userId?.name} ({order.userId?.email})
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Phone:</strong> {order.userId?.phone}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Delivered By:</strong> {order.deliveryPartnerId?.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Status:</strong> <span className="text-green-600 font-semibold">Completed</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Delivered On:</strong>{" "}
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !orders.length && (
          <p className="text-center text-gray-500 mt-6">No completed orders found.</p>
        )}
      </div>
    </div>
  );
};

export default GetCompOrdersByDP;
