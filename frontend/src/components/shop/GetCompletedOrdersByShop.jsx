import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetCompOrdersByShop = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warn("Please enter a Shop name, email or ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://grokart-2.onrender.com/api/v1/shop/completed-by-shop?query=${query}`,
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

  // ✅ Summary Calculations
  const fixedCharge = 25;
  const summary = orders.reduce(
    (acc, order) => {
      const netOrderAmount = order.totalAmount - fixedCharge;
      const commission = netOrderAmount * 0.05;
      const shopReceived = netOrderAmount - commission;

      acc.totalOrders += 1;
      acc.totalAmount += order.totalAmount;
      acc.totalNetAmount += netOrderAmount;
      acc.totalCommission += commission;
      acc.totalShopReceived += shopReceived;

      return acc;
    },
    {
      totalOrders: 0,
      totalAmount: 0,
      totalNetAmount: 0,
      totalCommission: 0,
      totalShopReceived: 0,
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Completed Orders by Shop
        </h2>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Shop ID, Name, or Email"
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
          <p className="text-center text-gray-500">
            Fetching completed orders...
          </p>
        )}

        {!loading && orders.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => {
                const netOrderAmount = order.totalAmount - fixedCharge;
                const commission = netOrderAmount * 0.05;
                const shopReceived = netOrderAmount - commission;

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Customer:</strong> {order.customerId?.name} (
                      {order.customerId?.email})
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Phone:</strong> {order.customerId?.phone}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Shop:</strong> {order.shopAssigned?.name} (
                      {order.shopAssigned?.email})
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Status:</strong>{" "}
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Total Amount:</strong> ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Delivered On:</strong>{" "}
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>

                    {/* ✅ Billing / Costing Details */}
                    <div className="mt-3 p-3 bg-gray-50 border rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Order Amount:</strong> ₹
                        {netOrderAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Our Commission (5%):</strong> ₹
                        {commission.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold text-green-700">
                        <strong>Shop Received:</strong> ₹
                        {shopReceived.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ Summary Section */}
            <div className="mt-10 bg-gray-100 p-6 rounded-xl border text-gray-800">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p>
                <strong>Total Orders:</strong> {summary.totalOrders}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{summary.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Total Order Amount (after -25 each):</strong> ₹
                {summary.totalNetAmount.toFixed(2)}
              </p>
              <p>
                <strong>Total Commission (5%):</strong> ₹
                {summary.totalCommission.toFixed(2)}
              </p>
              <p className="font-semibold text-green-700">
                <strong>Total Shop Received:</strong> ₹
                {summary.totalShopReceived.toFixed(2)}
              </p>
            </div>
          </>
        )}

        {!loading && !orders.length && (
          <p className="text-center text-gray-500 mt-6">
            No completed orders found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GetCompOrdersByShop;
