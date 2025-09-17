import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Send, Users, Megaphone, Plus, Trash2 } from "lucide-react";

export default function NotificationPanel() {
  const [mode, setMode] = useState("all"); // "all" or "users"
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [data, setData] = useState({});
  const [userIds, setUserIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDataChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addDataField = () => {
    setData((prev) => ({ ...prev, "": "" }));
  };

  const removeDataField = (key) => {
    const updated = { ...data };
    delete updated[key];
    setData(updated);
  };

  const handleSubmit = async () => {
    if (!title || !body) {
      alert("Title and Body are required!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        title,
        body,
        ...(image ? { image } : {}),
        ...(Object.keys(data).length ? { data } : {}),
      };

      let resp;
      if (mode === "all") {
        resp = await axios.post(
          "https://grokart-2.onrender.com/api/v1/push/notify-all",
          payload
        );
      } else {
        const ids = userIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        resp = await axios.post(
          "https://grokart-2.onrender.com/api/v1/push/notify-users",
          { ...payload, userIds: ids }
        );
      }

      setResult(resp.data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed to send notification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Megaphone className="w-8 h-8 text-blue-600" /> Admin Notifications
      </h1>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border">
        {/* Mode Selector */}
        <div className="flex gap-4">
          <button
            onClick={() => setMode("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "all"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Megaphone size={18} /> Notify All
          </button>
          <button
            onClick={() => setMode("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === "users"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Users size={18} /> Notify Specific Users
          </button>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="font-semibold">Image URL (Optional)</label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-semibold">Body</label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification body"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {mode === "users" && (
            <div className="md:col-span-2">
              <label className="font-semibold">User IDs (comma separated)</label>
              <textarea
                rows={2}
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                placeholder="e.g. 123, 456, 789"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Data Payload */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-semibold">Data Payload (Optional)</label>
            <button
              onClick={addDataField}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm"
            >
              <Plus size={16} /> Add Field
            </button>
          </div>
          {Object.entries(data).map(([k, v], idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <input
                value={k}
                onChange={(e) => {
                  const newKey = e.target.value;
                  const updated = { ...data };
                  delete updated[k];
                  updated[newKey] = v;
                  setData(updated);
                }}
                placeholder="Key"
                className="w-1/3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={v}
                onChange={(e) => handleDataChange(k, e.target.value)}
                placeholder="Value"
                className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeDataField(k)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Send size={18} />
            )}
            {mode === "all" ? "Send to All" : "Send to Users"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 rounded-xl bg-gray-100 border">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}
