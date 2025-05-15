// src/pages/products/DeleteProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteProduct = () => {
  const [productId, setProductId] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Please enter a product ID.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete product with ID: ${productId}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/product/delete-product`,
        {
          data: { productId },
        }
      );
      toast.success(res.data.message || "Product deleted successfully");
      setProductId("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong while deleting"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Delete Product</h1>
      <form onSubmit={handleDelete} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter Product ID to Delete
          </label>
          <input
            type="text"
            name="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 65fa8341b3e12345abcd1234"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Delete Product
        </button>
      </form>
    </div>
  );
};

export default DeleteProduct;
