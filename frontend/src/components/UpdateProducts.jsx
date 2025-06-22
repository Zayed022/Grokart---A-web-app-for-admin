import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from URL

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch product details on mount
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://grokart-2.onrender.com/api/v1/product/${id}`
        );
        const { name, description, price, stock, category } = res.data.product;
        setFormData({ name, description, price, stock, category });
      } catch (err) {
        toast.error("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.put(
        `https://grokart-2.onrender.com/api/v1/products/${id}`,
        formData
      );
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Product update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Update Product</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading product details...</p>
      ) : (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full ${
                submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateProduct;
