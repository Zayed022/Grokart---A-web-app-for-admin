import React, { useState } from "react";

const UpdateProduct = () => {
  const [identifier, setIdentifier] = useState("");
  const [updateType, setUpdateType] = useState("price"); // "price", "description", "image"
  const [newValue, setNewValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    if (!identifier) {
      setMessage("Please provide product ID or Name.");
      return;
    }

    if ((updateType !== "image" && !newValue) || (updateType === "image" && !imageFile)) {
      setMessage(`Please provide new ${updateType}.`);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let endpoint = "";
      let options = {};

      if (updateType === "price") {
        endpoint = "https://grokart-2.onrender.com/api/v1/products/update-price";
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            identifier.match(/^[0-9a-fA-F]{24}$/)
              ? { id: identifier, price: newValue }
              : { name: identifier, price: newValue }
          ),
        };
      } else if (updateType === "description") {
        endpoint = "https://grokart-2.onrender.com/api/v1/products/update-description";
        options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            identifier.match(/^[0-9a-fA-F]{24}$/)
              ? { id: identifier, description: newValue }
              : { name: identifier, description: newValue }
          ),
        };
      } else if (updateType === "image") {
        endpoint = "https://grokart-2.onrender.com/api/v1/products/update-image";

        const formData = new FormData();
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
          formData.append("id", identifier);
        } else {
          formData.append("name", identifier);
        }
        formData.append("image", imageFile);

        options = {
          method: "PUT",
          body: formData,
        };
      }

      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${updateType} updated successfully for ${data.product.name}`);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Update Product</h2>

      {/* Identifier Input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Product ID or Name</label>
        <input
          type="text"
          placeholder="Enter Product ID or Name"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      {/* Update Type */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Update Type</label>
        <select
          value={updateType}
          onChange={(e) => {
            setUpdateType(e.target.value);
            setNewValue("");
            setImageFile(null);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        >
          <option value="price">Price</option>
          <option value="description">Description</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* New Value Input */}
      {updateType !== "image" ? (
        <div className="mb-4">
          <label className="block mb-1 font-medium">New {updateType}</label>
          <input
            type={updateType === "price" ? "number" : "text"}
            placeholder={`Enter new ${updateType}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update"}
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default UpdateProduct;
