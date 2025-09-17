import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";

export default function Fee() {
  const [form, setForm] = useState({
    deliveryCharge: "",
    handlingFee: "",
    gstPercentage: "",
    lateNightFee: "",
    isLateNightActive: false,
    surgeFee: "",
    isSurgeActive: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  // Fetch current config
  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await axios.get("https://grokart-2.onrender.com/api/v1/fee");
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Failed to fetch fee config");
      } finally {
        setFetching(false);
      }
    };
    fetchFee();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.put(
        "https://grokart-2.onrender.com/api/v1/fee",
        form
      );
      setMessage("✅ Fee config updated successfully");
      setForm(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update fee config");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">⚙️ Fee Configuration</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border max-w-2xl"
      >
        {/* Delivery Charge */}
        <div>
          <label className="block font-semibold">Delivery Charge (₹)</label>
          <input
            type="number"
            name="deliveryCharge"
            value={form.deliveryCharge}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Handling Fee */}
        <div>
          <label className="block font-semibold">Handling Fee (₹)</label>
          <input
            type="number"
            name="handlingFee"
            value={form.handlingFee}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* GST */}
        <div>
          <label className="block font-semibold">GST (%)</label>
          <input
            type="number"
            name="gstPercentage"
            value={form.gstPercentage}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Late Night Fee */}
        <div>
          <label className="block font-semibold">Late Night Fee (₹)</label>
          <input
            type="number"
            name="lateNightFee"
            value={form.lateNightFee}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isLateNightActive"
              checked={form.isLateNightActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            Enable Late Night Fee
          </label>
        </div>

        {/* Surge Fee */}
        <div>
          <label className="block font-semibold">Surge Fee (₹)</label>
          <input
            type="number"
            name="surgeFee"
            value={form.surgeFee}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isSurgeActive"
              checked={form.isSurgeActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            Enable Surge Fee
          </label>
        </div>

        {/* Active Toggle */}
        <div>
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            Active Configuration
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100 text-gray-700 border">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
