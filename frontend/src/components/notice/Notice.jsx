import React, { useEffect, useState } from "react";
import axios from "axios";

const Notice = () => {
  const [activeNotice, setActiveNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    title: "",
    message: "",
    icon: "🔔",
    backgroundColor: "#fef3c7",
    textColor: "#92400e",
    isActive: true,
  });

  const [editForm, setEditForm] = useState(null);
  const API_BASE = "https://grokart-2.onrender.com/api/v1/notice";

  // Fetch active notice
  const fetchActiveNotice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/active`);
      setActiveNotice(res.data);
    } catch {
      setError("Failed to fetch active notice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveNotice();
  }, []);

  // Handle form input
  const handleChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/add`, form);
      setSuccess("Notice added successfully");
      setForm({
        title: "",
        message: "",
        icon: "🔔",
        backgroundColor: "#fef3c7",
        textColor: "#92400e",
        isActive: true,
      });
      fetchActiveNotice();
    } catch {
      setError("Failed to add notice");
    }
  };

  // Update notice
  const handleUpdateNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE}/${editForm._id}`, editForm);
      setSuccess("Notice updated successfully");
      setEditForm(null);
      fetchActiveNotice();
    } catch {
      setError("Failed to update notice");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">📢 Manage Notice</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Active Notice */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Active Notice</h2>
        {loading ? (
          <p>Loading...</p>
        ) : activeNotice ? (
          <div
            className="p-4 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: activeNotice.backgroundColor,
              color: activeNotice.textColor,
            }}
          >
            <span className="text-2xl">{activeNotice.icon}</span>
            <div>
              <h3 className="font-bold">{activeNotice.title}</h3>
              <p>{activeNotice.message}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No active notice found.</p>
        )}
      </div>

      {/* Add New Notice */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Notice</h2>
        <form onSubmit={handleAddNotice} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={form.title}
            onChange={(e) => handleChange(e, setForm)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            name="icon"
            placeholder="Emoji/Icon (e.g. 🔔)"
            value={form.icon}
            onChange={(e) => handleChange(e, setForm)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
          />
          <textarea
            name="message"
            placeholder="Notice Message"
            rows="3"
            value={form.message}
            onChange={(e) => handleChange(e, setForm)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300 col-span-2"
          />
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Background</label>
            <input
              type="color"
              name="backgroundColor"
              value={form.backgroundColor}
              onChange={(e) => handleChange(e, setForm)}
              className="w-16 h-10 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              name="textColor"
              value={form.textColor}
              onChange={(e) => handleChange(e, setForm)}
              className="w-16 h-10 rounded border"
            />
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(e) => handleChange(e, setForm)}
              className="h-5 w-5"
            />
            <label className="text-gray-700">Set as Active</label>
          </div>

          {/* Live Preview */}
          <div
            className="col-span-2 p-4 rounded-lg flex items-center gap-3 border"
            style={{ backgroundColor: form.backgroundColor, color: form.textColor }}
          >
            <span className="text-2xl">{form.icon}</span>
            <div>
              <h3 className="font-bold">{form.title || "Notice Title"}</h3>
              <p>{form.message || "Notice message will appear here..."}</p>
            </div>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
          >
            Add Notice
          </button>
        </form>
      </div>

      {/* Update Notice */}
      {activeNotice && (
        <div className="bg-white shadow-lg rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Update Notice</h2>
          <form
            onSubmit={handleUpdateNotice}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              defaultValue={activeNotice.title}
              onChange={(e) =>
                setEditForm({ ...activeNotice, [e.target.name]: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              name="icon"
              placeholder="Emoji/Icon (e.g. 🔔)"
              defaultValue={activeNotice.icon}
              onChange={(e) =>
                setEditForm({ ...activeNotice, [e.target.name]: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
            />
            <textarea
              name="message"
              placeholder="Notice Message"
              rows="3"
              defaultValue={activeNotice.message}
              onChange={(e) =>
                setEditForm({ ...activeNotice, [e.target.name]: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300 col-span-2"
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Background
              </label>
              <input
                type="color"
                name="backgroundColor"
                defaultValue={activeNotice.backgroundColor}
                onChange={(e) =>
                  setEditForm({ ...activeNotice, [e.target.name]: e.target.value })
                }
                className="w-16 h-10 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Text Color
              </label>
              <input
                type="color"
                name="textColor"
                defaultValue={activeNotice.textColor}
                onChange={(e) =>
                  setEditForm({ ...activeNotice, [e.target.name]: e.target.value })
                }
                className="w-16 h-10 rounded border"
              />
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={activeNotice.isActive}
                onChange={(e) =>
                  setEditForm({ ...activeNotice, [e.target.name]: e.target.checked })
                }
                className="h-5 w-5"
              />
              <label className="text-gray-700">Set as Active</label>
            </div>

            <button
              type="submit"
              className="col-span-2 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold shadow-md"
            >
              Update Notice
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Notice;
