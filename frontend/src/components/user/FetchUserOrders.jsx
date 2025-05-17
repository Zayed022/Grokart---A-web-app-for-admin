import React, { useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const FetchUserOrders = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`https://grokart-2.onrender.com/api/v1/users/by-user?query=${query}`);
      setOrders(data.orders);
    } catch (err) {
      setOrders([]);
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold text-center mb-8">📦 User Orders Lookup</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter user ID, name, or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? <LoaderCircle className="animate-spin h-5 w-5 mx-auto" /> : "Fetch Orders"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-5 shadow-md">
              <h3 className="font-semibold text-lg">Order ID: {order._id}</h3>
              <p><strong>User:</strong> {order.user?.name} ({order.user?.email})</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              {/* You can also map items if needed */}
              {order.items && order.items.length > 0 && (
                <ul className="mt-2 pl-5 list-disc text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              )}
            <p><strong>Address:</strong> ₹{order.address}</p>
            {order.addressDetails?.length > 0 && (
  <div className="mt-3 text-sm text-gray-700 space-y-1">
    <p className="font-medium underline">Address:</p>
    {order.addressDetails.map((item, idx) => (
      <div key={idx} className="pl-4 border-l border-gray-300">
        <p><strong>House No:</strong> {item.houseNumber}</p>
        <p><strong>Floor:</strong> {item.floor}</p>
        <p><strong>Building:</strong> {item.building}</p>
        <p><strong>Landmark:</strong> {item.landmark}</p>
        {/* Add more fields if available */}
      </div>
    ))}
  </div>
)}


            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p className="text-center text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default FetchUserOrders;
