import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CancelOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );
    if (!confirm) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/cancel",
        { orderId }
      );

      toast.success(response.data.message || "Order cancelled successfully");
      setOrderId("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to cancel the order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Cancel an Order
      </h2>

      <div className="mb-4">
        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
          Order ID
        </label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>

      <button
        onClick={handleCancel}
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {loading ? "Cancelling..." : "Cancel Order"}
      </button>
    </div>
  );
};

export default CancelOrder;
