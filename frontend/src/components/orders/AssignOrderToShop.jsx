import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const AssignOrderToShop = () => {
  const [orderId, setOrderId] = useState("");
  const [shopId, setShopId] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!orderId || !shopId) {
      toast.warn("Please enter both Order ID and select a Shop");
      return;
    }

    setAssigning(true);
    try {
      const res = await axios.post(
        "https://grokart-2.onrender.com/api/v1/shop/assign-order",
        {
          orderId: orderId.trim(),
          shopId: shopId.trim(),
        }
      );

      toast.success(res.data.message || "Order assigned successfully!");
      setOrderId("");
      setShopId("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign the order");
    } finally {
      setAssigning(false);
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
      console.error("Failed to fetch shops", error);
      toast.error("Error fetching shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Assign Order Form */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Assign Order to Shop</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Select Shop</label>
              <select
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Shop --</option>
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name} ({shop.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition ${
              assigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign Order
          </button>
        </div>
      </div>

      {/* All Shops Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Shops</h2>

          {loading ? (
            <div className="text-center text-gray-500 py-6">Loading shops...</div>
          ) : shops.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No shops found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Shop Name</th>
                    <th className="px-4 py-3">Shop ID</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shops.map((shop, index) => (
                    <tr key={shop._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{shop.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{shop._id}</td>
                      <td className="px-4 py-3">{shop.email}</td>
                      <td className="px-4 py-3">{shop.phone}</td>
                      <td className="px-4 py-3">
                        {shop.isApproved ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Approved
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignOrderToShop;
