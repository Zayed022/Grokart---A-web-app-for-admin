import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const GetProductById = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://grokart-2.onrender.com/api/v1/products/${productId}`
      );
      setProduct(data.product);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to fetch product details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {loading ? (
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      ) : !product ? (
        <div className="text-center text-red-500 text-md">
          Product not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square overflow-hidden rounded-xl shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-base mb-4">
                {product.description}
              </p>

              <div className="text-lg font-semibold text-gray-800 mb-2">
                ₹{product.price}
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

            <div className="mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetProductById;
