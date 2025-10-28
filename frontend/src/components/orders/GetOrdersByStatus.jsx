// OrderManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { io } from "socket.io-client";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [shops, setShops] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState({});

  const DELIVERY_FEE = 20; // Example flat fee
  const PLATFORM_FEE = 5; // Example flat fee
  const COMMISSION_RATE = 0.05; // 5% commission

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

  // ✅ Socket.io
  useEffect(() => {
    const socket = io("https://grokart-2.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Admin connected to socket:", socket.id);
    });

    socket.on("new-order", (orderData) => {
      toast.info(`🆕 New ${orderData.type.toUpperCase()} order placed!`, {
        position: "top-right",
        autoClose: 3000,
      });

      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => console.log("🔇 Autoplay blocked"));

      fetchOrders();
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
      const res = await axios.get(
        "https://grokart-2.onrender.com/api/v1/delivery/available",
        { withCredentials: true }
      );
      setPartners(res.data.data || []);
    } catch (err) {
      console.error("Error fetching partners", err);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/shop/get-all-shops",
        { withCredentials: true }
      );
      setShops(response.data.data || []);
    } catch (error) {
      toast.error("Error fetching shops");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);
  useEffect(() => {
    fetchPartners();
    fetchShops();
  }, []);

  const handleAssign = async (orderId) => {
    const { partnerId, shopId } = selectedAssignments[orderId] || {};
    if (!shopId) {
      toast.warn("Please select a Shop first");
      return;
    }
    setAssigning(true);
    try {
      const shopRes = await axios.post(
        "https://grokart-2.onrender.com/api/v1/shop/assign-order",
        { orderId, shopId },
        { withCredentials: true }
      );
      

      if (partnerId) {
        const partnerRes = await axios.post(
          "https://grokart-2.onrender.com/api/v1/delivery/assign-order",
          { orderId, deliveryPartnerId: partnerId, shopId },
          { withCredentials: true }
        );
        
      }
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  // inside OrderManagement.jsx

const handleMarkPaymentPaid = async (orderId) => {
  try {
    setAssigning(true);
    const res = await axios.patch(
      "https://grokart-2.onrender.com/api/v1/admin/update-payment-status",
      { orderId, paymentStatus: "Paid" },
      { withCredentials: true }
    );
    
    fetchOrders();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update payment status");
  } finally {
    setAssigning(false);
  }
};

const handleUpdateStatus = async (orderId, newStatus) => {
  try {
    setAssigning(true);
    const res = await axios.patch(
      `https://grokart-2.onrender.com/api/v1/order/update-order-status/${orderId}`,
      { status: newStatus },
      { withCredentials: true }
    );
    
    fetchOrders();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update order status");
  } finally {
    setAssigning(false);
  }
};


const handleCancelOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  try {
    setAssigning(true);
    const res = await axios.post(
      "https://grokart-2.onrender.com/api/v1/admin/cancel-order",
      { orderId },
      { withCredentials: true }
    );
    toast.success(res.data.message || "Order cancelled successfully");
    fetchOrders(); // refresh order list
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel order");
  } finally {
    setAssigning(false);
  }
};



  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-sm font-semibold inline-block";
    switch (status) {
      case "Delivered":
        return `${base} bg-green-100 text-green-700`;
      case "Cancelled":
        return `${base} bg-red-100 text-red-700`;
      case "Placed":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-blue-100 text-blue-700`;
    }
  };

  const getPaymentBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-sm font-semibold inline-block";
    switch (paymentStatus) {
      case "Paid":
        return `${base} bg-green-300 text-green-700`;
      case "Unpaid":
        return `${base} bg-red-100 text-red-700`;
      
    }
  };

  const renderAddress = (order) => {
    if (!order.addressDetails) return <p>{order.address}</p>;
    const d = order.addressDetails;
    return (
      <div className="space-y-1">
        <p>{order.address}</p>
        <small className="text-xs text-gray-500 leading-snug block">
          {d.houseNumber}, {d.floor}, {d.building}, {d.landmark},{" "}
          {d.city}, {d.state} - {d.pincode} <br />
          📞 {d.recipientPhoneNumber}
        </small>
      </div>
    );
  };

  const renderCosting = (order) => {
    const baseAmount = order.totalAmount-25;
    const deliveryFee = DELIVERY_FEE;
    const platformFee = PLATFORM_FEE;
    const finalAmount = baseAmount + deliveryFee + platformFee;
    const shopEarnings = baseAmount * (1 - COMMISSION_RATE);

    return (
      <div className="text-xs text-gray-600 space-y-1 mt-1">
        <p>🛒 Subtotal: ₹{baseAmount}</p>
        <p>🚚 Delivery Fee: ₹{deliveryFee}</p>
        <p>⚙️ Platform Fee: ₹{platformFee}</p>
        <p className="font-semibold">💰 Final Amount: ₹{finalAmount}</p>
        <p className="text-green-700 font-semibold">
          🏪 Shop Receives: ₹{shopEarnings.toFixed(2)}
        </p>
      </div>
    );
  };

 return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📦 Order Management</h1>

        <button
        onClick={fetchOrders}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Refresh
      </button>

      {/* Filter */}
      <div className="sticky top-0 z-10 bg-gray-50 py-3 mb-6 flex items-center gap-3 shadow-sm">
        <label className="font-semibold text-gray-700">Filter by Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
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
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Costing</th>
                  <th className="px-4 py-2">Shop</th>
                  <th className="px-4 py-2">Partner</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Paid/Unpaid</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 align-top"
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">
                      <p className="font-semibold">{order.customerId?.name}</p>
                      <p className="text-xs text-gray-500">
                        {order.customerId?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-2">{renderAddress(order)}</td>

                    {/* Items always visible */}
                    <td className="px-4 py-2">
                      <ul className="list-disc pl-4 space-y-1">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.name} <br /> <div className="font-bold">DESC: {item.description}</div> <div className="font-bold">QTY: {item.quantity}</div> <div className="font-bold">₹{item.price}</div> 
                          </li>
                          
                          
                        ))}
                      </ul>
                    </td>

                    

                    <td className="px-4 py-2">{renderCosting(order)}</td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" ? (
                        <select
                          value={selectedAssignments[order._id]?.shopId || ""}
                          onChange={(e) =>
                            setSelectedAssignments((prev) => ({
                              ...prev,
                              [order._id]: {
                                ...prev[order._id],
                                shopId: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="">-- Select Shop --</option>
                          {shops.map((shop) => (
                            <option key={shop._id} value={shop._id}>
                              {shop.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.shopAssigned?.name || "—"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" ? (
                        <select
                          value={selectedAssignments[order._id]?.partnerId || ""}
                          onChange={(e) =>
                            setSelectedAssignments((prev) => ({
                              ...prev,
                              [order._id]: {
                                ...prev[order._id],
                                partnerId: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="">-- Select Partner --</option>
                          {partners.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} ({p.phone})
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.assignedTo?.name || "—"
                      )}
                    </td>
                    

                    <td
  className={`px-4 py-2 font-semibold ${
    order.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
  }`}
>
  {order.paymentStatus} ({order.paymentMethod})
</td>

                    <td className="px-4 py-2">
  <div className="flex items-center gap-2">
    <span className={getStatusBadge(order.status)}>{order.status}</span>
    <select
      value={order.status}
      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
      className="border rounded px-2 py-1 text-sm"
      disabled={assigning}
    >
      {statuses.filter((s) => s !== "All").map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>
</td>


                    <td className="px-4 py-2">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {order.status === "Placed" && (
                        <button
                          onClick={() => handleAssign(order._id)}
                          disabled={assigning}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2"
                        >
                          {assigning && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          Assign
                        </button>
                        
                      )}
                    </td>
                    <td className="px-4 py-2">
  {order.status === "Delivered" && order.paymentStatus !== "Paid" ? (
    <button
      onClick={() => handleMarkPaymentPaid(order._id)}
      disabled={assigning}
      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2"
    >
      {assigning && <Loader2 className="h-3 w-3 animate-spin" />}
      Mark Payment Paid
    </button>
  ) : (
    "—"
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
    <div
      key={order._id}
      className="bg-white rounded-xl shadow-md p-4 space-y-3 border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-800">
          #{order._id.slice(-6)}
        </h2>
      </div>

      {/* Status Section */}
      <div className="space-y-1">
        <p className="text-gray-700 font-semibold">Status:</p>
        <div className="flex items-center justify-between gap-2">
          {/* Current status badge */}
          <span className={`${getStatusBadge(order.status)} px-3 py-1 rounded-full text-xs font-medium`}>
            {order.status}
          </span>

          {/* Dropdown to update status */}
          <select
            value={order.status}
            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={assigning}
          >
            {statuses.filter((s) => s !== "All").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer */}
      <p className="text-gray-700">
        <span className="font-semibold">Customer:</span>{" "}
        {order.customerId?.name} ({order.customerId?.phone})
      </p>

      {/* Address */}
      <div>
        <span className="font-semibold">Address:</span>{" "}
        {renderAddress(order)}
      </div>

      {/* Items */}
      <div>
        <span className="font-semibold">Items:</span>
        <ul className="list-disc pl-5 mt-1 text-gray-700 text-sm space-y-0.5">
          {order.items.map((item, i) => (
            <li key={i}>
              <div className="text-md">{item.name}</div> 
              <div className="">Desc: {item.description}</div> 
              <div className="font-bold">QTY: {item.quantity}</div> 
               <div className="font-bold">Price: {item.price}</div> 
            </li>
          ))}
        </ul>
      </div>

      {/* Costing */}
      {renderCosting(order)}

      {/* Payment */}
      <p>
        <span className="font-semibold">Payment:</span>{" "}
        {order.paymentStatus} ({order.paymentMethod})
      </p>

      {/* Mark as Paid Button */}
      {order.status === "Delivered" && order.paymentStatus !== "Paid" && (
        <button
          onClick={() => handleMarkPaymentPaid(order._id)}
          disabled={assigning}
          className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 mt-2 hover:bg-green-700 transition"
        >
          {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
          Mark Payment Paid
        </button>
      )}

      {/* Created Date */}
      <p className="text-gray-600 text-sm">
        <span className="font-semibold">Created:</span>{" "}
        {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* Assignment Section */}
      {order.status === "Placed" && (
        <div className="space-y-2 mt-2">
          <select
            value={selectedAssignments[order._id]?.shopId || ""}
            onChange={(e) =>
              setSelectedAssignments((prev) => ({
                ...prev,
                [order._id]: {
                  ...prev[order._id],
                  shopId: e.target.value,
                },
              }))
            }
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Shop --</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>

          <select
            value={selectedAssignments[order._id]?.partnerId || ""}
            onChange={(e) =>
              setSelectedAssignments((prev) => ({
                ...prev,
                [order._id]: {
                  ...prev[order._id],
                  partnerId: e.target.value,
                },
              }))
            }
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Partner --</option>
            {partners.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>

          <button
            onClick={() => handleAssign(order._id)}
            disabled={assigning}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition"
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
