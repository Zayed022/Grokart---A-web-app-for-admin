import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AllOrdersByTime = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/delivered-orders",
        { withCredentials: true }
      );
      setOrders(data.data);
      setFilteredOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer Name", "Customer Email", "Delivery Partner Name", "Phone", "Placed At", "Delivered At", "Total Amount"];
    const rows = filteredOrders.map(order => [
      order.orderId,
      order.userName,
      order.userEmail,
      order.deliveryPartner.name,
      order.deliveryPartner.phone,
      format(new Date(order.placedAt), "PPpp"),
      format(new Date(order.deliveredAt), "PPpp"),
      `₹${order.totalAmount}`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "delivered_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    if (value === "today") {
      const today = new Date().toISOString().split("T")[0];
      setFilteredOrders(
        orders.filter(order => new Date(order.deliveredAt).toISOString().startsWith(today))
      );
    } else if (value === "last7") {
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      setFilteredOrders(
        orders.filter(order => new Date(order.deliveredAt) >= weekAgo && new Date(order.deliveredAt) <= now)
      );
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📦 Delivered Orders – Timestamps View
          </h2>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Export to CSV
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => handleFilterChange("all")} className={`px-3 py-1 rounded-md border ${filter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"}`}>All</button>
          <button onClick={() => handleFilterChange("today")} className={`px-3 py-1 rounded-md border ${filter === "today" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"}`}>Today</button>
          <button onClick={() => handleFilterChange("last7")} className={`px-3 py-1 rounded-md border ${filter === "last7" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"}`}>Last 7 Days</button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No delivered orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between flex-wrap">
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      🆔 Order ID: <span className="text-gray-900">{order.orderId}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      👤 Customer: {order.userName} ({order.userEmail})
                    </p>
                    <p className="text-sm text-gray-600">
                      🚚 Delivered by: {order.deliveryPartner.name} ({order.deliveryPartner.phone})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Placed At: <span className="text-gray-700 font-medium">{format(new Date(order.placedAt), "PPpp")}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Delivered At: <span className="text-green-700 font-medium">{format(new Date(order.deliveredAt), "PPpp")}</span>
                    </p>
                    <p className="text-base font-bold text-blue-700 mt-2">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
                {order.items.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700">Items:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.name} × {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrdersByTime;