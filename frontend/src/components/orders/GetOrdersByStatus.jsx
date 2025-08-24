import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { io } from "socket.io-client"; // ✅ Import socket.io client

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [shops, setShops] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState({});

  const statuses = [
    "All",
    "Pending",
    "Placed",
    "Confirmed",
    "Ready to Collect",
    "Assigned",
    "Picked Up",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // ✅ Initialize socket.io
  useEffect(() => {
    const socket = io("https://grokart-2.onrender.com", { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("✅ Admin connected to socket:", socket.id);
    });

    // ✅ Listen for new order events
    socket.on("new-order", (orderData) => {
      console.log("📦 New order received:", orderData);
      toast.info(`🆕 New ${orderData.type.toUpperCase()} order placed!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Optional: Play notification sound
      const audio = new Audio("/notification.mp3"); // put file in /public
      audio.play().catch(() => console.log("🔇 Autoplay blocked"));

      // Refresh orders automatically
      fetchOrders();
    });

    socket.on("disconnect", () => {
      console.log("❌ Admin socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://grokart-2.onrender.com/api/v1/order/orders-status?status=${status}`,
        { withCredentials: true }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axios.get("https://grokart-2.onrender.com/api/v1/delivery/available", { withCredentials: true });
      setPartners(res.data.data || []);
    } catch (err) {
      console.error("Error fetching partners", err);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get("https://grokart-2.onrender.com/api/v1/shop/get-all-shops", { withCredentials: true });
      setShops(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch shops", error);
      toast.error("Error fetching shops");
    }
  };

  useEffect(() => { fetchOrders(); }, [status]);
  useEffect(() => { fetchPartners(); fetchShops(); }, []);

  const handleAssign = async (orderId) => {
    const { partnerId, shopId } = selectedAssignments[orderId] || {};
    if (!shopId) {
      toast.warn("Please select a Shop first");
      return;
    }
    setAssigning(true);
    try {
      const shopRes = await axios.post("https://grokart-2.onrender.com/api/v1/shop/assign-order",
        { orderId, shopId }, { withCredentials: true }
      );
      toast.success(shopRes.data.message || "Order assigned to shop");

      if (partnerId) {
        const partnerRes = await axios.post("https://grokart-2.onrender.com/api/v1/delivery/assign-order",
          { orderId, deliveryPartnerId: partnerId, shopId }, { withCredentials: true }
        );
        toast.success(partnerRes.data.message || "Order also assigned to delivery partner");
      }
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Delivered": return `${base} bg-green-100 text-green-700`;
      case "Cancelled": return `${base} bg-red-100 text-red-700`;
      case "Placed": return `${base} bg-yellow-100 text-yellow-700`;
      default: return `${base} bg-blue-100 text-blue-700`;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📦 Order Management</h1>

      {/* Filter Bar */}
      <div className="sticky top-0 z-10 bg-gray-50 py-3 mb-6 flex items-center gap-3 shadow-sm">
        <label className="font-semibold text-gray-700">Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-200 text-left text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Shop</th>
                  <th className="px-4 py-2">Partner</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">
                      <p className="font-semibold">{order.customerId?.name}</p>
                      <p className="text-xs text-gray-500">{order.customerId?.phone}</p>
                    </td>
                    <td className="px-4 py-2">
                      <details>
                        <summary className="cursor-pointer text-blue-600">View</summary>
                        <ul className="list-disc pl-4 mt-1">
                          {order.items.map((item, i) => (
                            <li key={i}>{item.name} × {item.quantity} - ₹{item.price}</li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" ? (
                        <select
                          value={selectedAssignments[order._id]?.shopId || ""}
                          onChange={(e) =>
                            setSelectedAssignments((prev) => ({
                              ...prev,
                              [order._id]: { ...prev[order._id], shopId: e.target.value },
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="">-- Select Shop --</option>
                          {shops.map((shop) => (
                            <option key={shop._id} value={shop._id}>{shop.name}</option>
                          ))}
                        </select>
                      ) : order.shopAssigned?.name || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" ? (
                        <select
                          value={selectedAssignments[order._id]?.partnerId || ""}
                          onChange={(e) =>
                            setSelectedAssignments((prev) => ({
                              ...prev,
                              [order._id]: { ...prev[order._id], partnerId: e.target.value },
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="">-- Select Partner --</option>
                          {partners.map((p) => (
                            <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                          ))}
                        </select>
                      ) : order.assignedTo?.name || "—"}
                    </td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                    <td className="px-4 py-2">{order.isPaid ? "Paid" : "Unpaid"} ({order.paymentMethod})</td>
                    <td className="px-4 py-2"><span className={getStatusBadge(order.status)}>{order.status}</span></td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" && (
                        <button
                          onClick={() => handleAssign(order._id)}
                          disabled={assigning}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2"
                        >
                          {assigning && <Loader2 className="h-3 w-3 animate-spin" />}
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid md:hidden gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold">#{order._id.slice(-6)}</h2>
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </div>
                <p><span className="font-semibold">Customer:</span> {order.customerId?.name} ({order.customerId?.phone})</p>
                <p><span className="font-semibold">Amount:</span> ₹{order.totalAmount}</p>
                <p><span className="font-semibold">Payment:</span> {order.isPaid ? "Paid" : "Unpaid"} ({order.paymentMethod})</p>
                <p><span className="font-semibold">Created:</span> {new Date(order.createdAt).toLocaleString()}</p>

                <details>
                  <summary className="cursor-pointer text-blue-600">View Items</summary>
                  <ul className="list-disc pl-4 mt-1">
                    {order.items.map((item, i) => (
                      <li key={i}>{item.name} × {item.quantity} - ₹{item.price}</li>
                    ))}
                  </ul>
                </details>

                {order.status === "Placed" && (
                  <div className="space-y-2">
                    <select
                      value={selectedAssignments[order._id]?.shopId || ""}
                      onChange={(e) =>
                        setSelectedAssignments((prev) => ({
                          ...prev,
                          [order._id]: { ...prev[order._id], shopId: e.target.value },
                        }))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="">-- Select Shop --</option>
                      {shops.map((shop) => (
                        <option key={shop._id} value={shop._id}>{shop.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedAssignments[order._id]?.partnerId || ""}
                      onChange={(e) =>
                        setSelectedAssignments((prev) => ({
                          ...prev,
                          [order._id]: { ...prev[order._id], partnerId: e.target.value },
                        }))
                      }
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="">-- Select Partner --</option>
                      {partners.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAssign(order._id)}
                      disabled={assigning}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
                      Assign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;
