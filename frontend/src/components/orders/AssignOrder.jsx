import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const AssignOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [availablePartners, setAvailablePartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const fetchAvailablePartners = async () => {
    try {
      const res = await axios.get(
        "https://grokart-2.onrender.com/api/v1/delivery/available",
        { withCredentials: true }
      );
      setAvailablePartners(res.data.data || []);
    } catch (error) {
      console.error("Failed to load partners", error);
      toast.error("Could not fetch available delivery partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailablePartners();
  }, []);

  const handleAssign = async () => {
    if (!orderId.trim() || !partnerId.trim()) {
      toast.warn("Please select a Delivery Partner and enter a valid Order ID.");
      return;
    }

    setAssigning(true);
    try {
      const res = await axios.post(
        "https://grokart-2.onrender.com/api/v1/delivery/assign-order",
        {
          orderId: orderId.trim(),
          deliveryPartnerId: partnerId.trim(),
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Order assigned successfully");
      setOrderId("");
      setPartnerId("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Section 1: Assignment Form */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Assign Order Manually</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Delivery Partner</label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Partner --</option>
                {availablePartners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning}
            className={`mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 ${
              assigning ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {assigning && <Loader2 className="animate-spin h-4 w-4" />}
            Assign Order
          </button>
        </div>
      </div>

      {/* Section 2: Available Partners Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Delivery Partners</h2>

          {loading ? (
            <div className="text-center text-gray-600 py-6">Loading partners...</div>
          ) : availablePartners.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No delivery partners are available at the moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {availablePartners.map((partner, index) => (
                    <tr key={partner._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{partner._id}</td>
                      <td className="px-4 py-3">{partner.name}</td>
                      <td className="px-4 py-3">{partner.email}</td>
                      <td className="px-4 py-3">{partner.phone}</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Available
                        </span>
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

export default AssignOrder;
