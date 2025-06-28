// src/pages/orders/GetOrderById.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetOrderById = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);

  /* GET /api/v1/orders/:orderId */
  const fetchOrder = async () => {
    if (!orderId.trim()) return toast.warn("Please enter an Order ID");

    setLoading(true);
    setOrder(null);

    try {
      const { data } = await axios.get(
        `https://grokart-2.onrender.com/api/v1/order/${orderId}`,
        { withCredentials: true }
      );

      setOrder(data.order);
      toast.success(data.message);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error || "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  /* helper to render a pill with different colours */
  const Pill = ({ ok, yes = "Paid", no = "Pending" }) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        ok ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {ok ? yes : no}
    </span>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Search Order
      </h1>

      {/* ---- Search bar ---- */}
      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2
                     focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={fetchOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium
                     hover:bg-blue-700 transition"
        >
          Get Order
        </button>
      </div>

      {/* ---- Loader / result ---- */}
      {loading && <p className="text-gray-600">Loading order details…</p>}

      {order && (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* header */}
          <div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Order #{order._id}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* customer */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Customer</h3>
              <p className="text-sm text-gray-600">
                {order.customerId?.name} &nbsp;
                <span className="text-gray-500">({order.customerId?.email})</span>
              </p>
            </div>

            {/* assignedTo */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Assigned To</h3>
              <p className="text-sm text-gray-600">
                {order.assignedTo
                  ? `${order.assignedTo.name} (${order.assignedTo.phone})`
                  : "Not Assigned"}
              </p>
            </div>

            {/* total */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Total Amount</h3>
              <p className="text-sm text-gray-600">
                ₹{order.totalAmount}
                {order.codCharge > 0 && (
                  <span className="text-xs text-red-500"> </span>
                )}
              </p>
            </div>

            {/* payment method */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                Payment Method
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {order.paymentMethod}
              </p>
            </div>

            {/* payment status */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                Payment Status
              </h3>
              <p className="text-sm text-green-700 font-medium">{order.paymentStatus}</p>
            </div>

            {/* order status */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
              <p className="text-sm text-blue-700 font-medium">
                {order.status}
              </p>
            </div>

            {/* address */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-1">Address</h3>
              <p className="text-sm text-gray-600">{order.address}</p>
              {order.addressDetails && (
                <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                  {JSON.stringify(order.addressDetails, null, 2)}
                </pre>
              )}
            </div>

            {/* items */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-1">Items</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {order.items.map((it) => (
                  <li key={it.productId}>
                    {it.name} (QTY:{it.description}) × {it.quantity} — ₹{it.price}     
                    
                  </li>
                  
                ))}
              </ul>
            </div>

            {/* status history */}
            {order.statusHistory?.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-1">
                  Status History
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {order.statusHistory.map((s, i) => (
                    <li key={i}>
                      {s.status} –{" "}
                      <span className="text-gray-500">
                        {new Date(s.updatedAt || s.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetOrderById;
