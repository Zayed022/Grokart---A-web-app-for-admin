import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SearchOrders = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.warn("Enter a search term");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/admin/search",
        { query }
      );
      setOrders(data.orders);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Search Orders</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, name, email, or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Searching...</p>}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Order #{order._id}
              </h3>
              <p className="text-sm text-gray-600">
                Customer: {order.customerId?.name} ({order.customerId?.email} /{" "}
                {order.customerId?.phone})
              </p>
              <p className="text-sm text-gray-600">
                Total: ₹{order.totalAmount} | Method: {order.paymentMethod} |{" "}
                Status: {order.status}
              </p>
              <p className="text-sm text-gray-500">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && !orders.length && (
        <p className="text-gray-500">No orders to display</p>
      )}
    </div>
  );
};

export default SearchOrders;
