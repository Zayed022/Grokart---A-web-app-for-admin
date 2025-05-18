import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePaymentStatus = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/get-orders",
        { withCredentials: true }
      );
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedOrderId) {
    return toast.warn("Choose an order first!");
  }

  setLoading(true);

  try {
    const { data } = await axios.patch(
      "https://grokart-2.onrender.com/api/v1/admin/update-payment-status",
      { orderId: selectedOrderId, paymentStatus },
      { withCredentials: true }
    );

    toast.success(data.message || "Payment status updated");

    /* 🔄  RE-FETCH list so the UI shows the new status */
    await fetchOrders();
    /* Or, if you don’t want a second trip: mutate locally
       setOrders((prev) =>
         prev.map((o) =>
           o._id === selectedOrderId ? { ...o, paymentStatus } : o
         )
       );
    */
    setSelectedOrderId("");
  } catch (err) {
    console.error(err);
    toast.error(
      err?.response?.data?.message || "Failed to update payment status"
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Payment Status
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Order
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose an Order --</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  #{order._id.slice(-6)} - ₹{order.totalAmount} - {order.paymentStatus}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <button
  type="submit"
  disabled={loading || !selectedOrderId}
  className={`w-full py-2 rounded-lg text-white ${
    loading || !selectedOrderId
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  } transition`}
>
  {loading ? "Updating…" : "Update Payment Status"}
</button>

        </form>
      </div>
    </div>
  );
};

export default UpdatePaymentStatus;
