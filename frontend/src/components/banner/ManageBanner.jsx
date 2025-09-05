import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    redirectUrl: "",
    isActive: false,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const API_BASE = "https://grokart-2.onrender.com/api/v1/banner";

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/active`);
      setBanners(res.data);
    } catch {
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add banner
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!form.title || !form.redirectUrl || !form.image) {
      setError("All fields are required.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("redirectUrl", form.redirectUrl);
      formData.append("isActive", form.isActive);
      formData.append("image", form.image);

      await axios.post(`${API_BASE}/add-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ title: "", redirectUrl: "", isActive: false, image: null });
      setPreview(null);
      fetchBanners();
    } catch {
      setError("Failed to upload banner");
    } finally {
      setUploading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchBanners();
    } catch {
      setError("Failed to delete banner");
    }
  };

  // Toggle status
  const handleToggleActive = async (id, currentState) => {
    try {
      await axios.put(`${API_BASE}/${id}`, { isActive: !currentState });
      fetchBanners();
    } catch {
      setError("Failed to update banner status");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">📢 Manage Banners</h1>

      {/* Add Banner Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-12 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Banner</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleAddBanner}
        >
          <input
            type="text"
            name="title"
            placeholder="Banner Title"
            value={form.title}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            name="redirectUrl"
            placeholder="Redirect URL"
            value={form.redirectUrl}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <label className="text-gray-700">Active</label>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="col-span-2"
          />

          {/* Preview */}
          {preview && (
            <div className="col-span-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="h-40 rounded-lg shadow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
          >
            {uploading ? "Uploading..." : "Add Banner"}
          </button>
        </form>
      </div>

      {/* Banner List */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-700">All Banners</h2>
        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                  <a
                    href={banner.redirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 underline break-all"
                  >
                    {banner.redirectUrl}
                  </a>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>

                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() =>
                        handleToggleActive(banner._id, banner.isActive)
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {banners.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">
                No banners found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBanner;
