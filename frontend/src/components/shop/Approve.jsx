import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ApproveShop = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    if (!email.trim()) {
      toast.warn("Please enter an email");
      return;
    }

    setLoading(true);
    setStatus("");
    setApproved(false);

    try {
      const res = await axios.post(
        "https://grokart-2.onrender.com/api/v1/shop/approve",
        { email },
        { withCredentials: true }
      );

      setStatus(res.data.message);
      setApproved(res.data.message.includes("successfully"));
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Approve Shop</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Shop Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter shop's email"
          />
        </div>

        <button
          onClick={handleApprove}
          disabled={loading}
          className="w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Approving..." : "Approve"}
        </button>

        {status && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm font-medium ${
              approved
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveShop;
