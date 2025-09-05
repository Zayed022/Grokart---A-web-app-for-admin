import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [codEnabled, setCodEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://grokart-2.onrender.com/api/v1/setting/");
        setCodEnabled(res.data.codEnabled);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setMessage("⚠️ Failed to fetch settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Save updated settings to backend
  const handleToggle = async () => {
    setSaving(true);
    try {
      const res = await axios.put("https://grokart-2.onrender.com/api/v1/setting/", {
        codEnabled: !codEnabled,
      });
      setCodEnabled(res.data.codEnabled);
      setMessage(
        res.data.codEnabled
          ? "✅ COD orders enabled successfully."
          : "🚫 COD orders disabled successfully."
      );
    } catch (err) {
      console.error("Error updating settings:", err);
      setMessage("⚠️ Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ⚙️ Application Settings
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Cash on Delivery
              </h3>
              <p className="text-sm text-gray-500">
                {codEnabled
                  ? "Users can place orders using COD."
                  : "COD orders are currently disabled."}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                codEnabled ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  codEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div
            className={`mt-6 text-sm font-medium text-center px-4 py-2 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : message.startsWith("🚫")
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
