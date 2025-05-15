import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/products/get-product"
      );
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        All Products <span className="text-gray-500">({products.length})</span>
      </h1>

      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 text-md">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col"
            >
              <div className="aspect-video overflow-hidden rounded-xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {product.description}
              </p>

              <div className="text-sm text-gray-700 mb-1">
                <strong>Price:</strong> ₹{product.price}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <strong>Stock:</strong> {product.stock}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                <strong>Category:</strong> {product.category}
              </div>
              {product.subCategory && (
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Subcategory:</strong> {product.subCategory}
                </div>
              )}
              {product.miniCategory && (
                <div className="text-sm text-gray-700">
                  <strong>Mini Category:</strong> {product.miniCategory}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllProducts;
