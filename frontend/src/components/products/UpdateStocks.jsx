import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateStock = () => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    stock: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [settingEight, setSettingEight] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const { productId, productName, stock } = formData;

    if (!productId && !productName) {
      toast.error("Please provide either Product ID or Product Name.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter a valid stock number.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.put(
        "https://grokart-2.onrender.com/api/v1/products/stock",
        {
          ...(productId && { productId }),
          ...(productName && { productName }),
          stock: Number(stock),
        }
      );

      toast.success(response.data.message || "Stock updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product stock.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetStock = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset stock of all products to 0?");
    if (!confirmReset) return;

    setResetting(true);

    try {
      const response = await axios.put("https://grokart-2.onrender.com/api/v1/products/reset-stock");
      toast.success(response.data.message || "All stock reset successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset stock.");
    } finally {
      setResetting(false);
    }
  };

  const handleSetStockToEight = async () => {
    const confirmSet = window.confirm("Set stock of all products with stock <= 0 to 8?");
    if (!confirmSet) return;

    setSettingEight(true);

    try {
      const response = await axios.put("https://grokart-2.onrender.com/api/v1/products/set-stock-to-eight");
      toast.success(response.data.message || "Stock updated to 8 for eligible products.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock to 8.");
    } finally {
      setSettingEight(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-12">
      {/* Card 1: Update Single Product Stock */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Product Stock</h2>
        <form onSubmit={handleUpdateStock} className="space-y-4">
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="Product ID (optional)"
            className="block w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name (optional)"
            className="block w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="New Stock *"
            min="0"
            required
            className="block w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className={`w-full ${
              submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-2 px-4 rounded-md transition`}
          >
            {submitting ? "Updating..." : "Update Stock"}
          </button>
        </form>
      </div>

      {/* Card 2: Reset All Stock to 0 */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-t-4 border-red-600">
        <h2 className="text-xl font-semibold text-red-700">Danger Zone: Reset All Stocks to 0</h2>
        <p className="text-sm text-gray-600">
          This will set stock of <strong>all products</strong> to <code>0</code>. Proceed with caution.
        </p>
        <button
          onClick={handleResetStock}
          disabled={resetting}
          className={`w-full ${
            resetting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          } text-white font-semibold py-2 px-4 rounded-md transition`}
        >
          {resetting ? "Resetting..." : "Reset All Stock to 0"}
        </button>
      </div>

      {/* Card 3: Set Stock to 8 where Stock <= 0 */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-t-4 border-green-600">
        <h2 className="text-xl font-semibold text-green-700">
          Fix Low Stock: Set Stock to 8 Where Stock ≤ 0
        </h2>
        <p className="text-sm text-gray-600">
          This will only update products where stock is <code>0 or below</code>, and set them to <strong>8</strong>.
        </p>
        <button
          onClick={handleSetStockToEight}
          disabled={settingEight}
          className={`w-full ${
            settingEight ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-2 px-4 rounded-md transition`}
        >
          {settingEight ? "Processing..." : "Set Stock to 8"}
        </button>
      </div>
    </div>
  );
};

export default UpdateStock;
