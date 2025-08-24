// src/components/GetPlacedOrder.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const GetPlacedOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlacedOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("https://grokart-2.onrender.com/api/v1/order/placed"); // ✅ your backend route
        setOrders(data.orders || []);
      } catch (err) {
        setError("Failed to fetch placed orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlacedOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading placed orders...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-10 text-gray-500">No placed orders found.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Placed Orders ({orders.length})
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Total Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-mono text-sm text-gray-600">
                  {order._id}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customerId?.name}</p>
                  <p className="text-sm text-gray-500">{order.customerId?.phone}</p>
                </td>
                <td className="px-4 py-3">
                  {order.items.map((p, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      {p.productId?.name} × {p.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  ₹{order.totalAmount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetPlacedOrder;
