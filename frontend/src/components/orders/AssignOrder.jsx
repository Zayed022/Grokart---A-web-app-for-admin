import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AssignOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [partnerId, setPartnerId] = useState("");

  const handleAssign = async () => {
    if (!orderId || !partnerId) {
      toast.warn("Please enter both Order ID and Delivery Partner ID");
      return;
    }

    try {
      const res = await axios.post(
        "https://grokart-2.onrender.com/api/v1/delivery/assign-order",
        {
          orderId: orderId.trim(),
          deliveryPartnerId: partnerId.trim(),
        }
      );

      toast.success(res.data.message);
      setOrderId("");
      setPartnerId("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to assign the order"
      );
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Manually Assign Order
      </h1>

      <div className="space-y-6 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter full Order ID"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Delivery Partner ID:</label>
          <input
            type="text"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            placeholder="Enter Delivery Partner ID"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Assign Order
      </button>
    </div>
  );
};

export default AssignOrder;
