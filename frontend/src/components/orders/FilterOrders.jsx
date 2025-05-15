import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FilterOrders = () => {
  const [filters, setFilters] = useState({
    paymentStatus: "",
    status: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [orders, setOrders] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchFilteredOrders = async () => {
    try {
      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/admin/filter-orders",
        filters
      );
      setOrders(data.orders);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching orders");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Filter Orders
      </h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Payment Status
            </label>
            <input
              type="text"
              name="paymentStatus"
              placeholder="e.g. paid, pending"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Order Status
            </label>
            <input
              type="text"
              name="status"
              placeholder="e.g. Placed, Delivered"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Bhiwandi"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">State</label>
            <input
              type="text"
              name="state"
              placeholder="e.g. Maharashtra"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              name="minAmount"
              placeholder="₹ Min"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              name="maxAmount"
              placeholder="₹ Max"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={fetchFilteredOrders}
            className="bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Search Orders
          </button>
        </div>
      </div>

      <div className="mt-8">
        {orders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    #{order._id.slice(-6)}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> ₹{order.totalAmount}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>City:</strong> {order.addressDetails?.city || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12 text-lg">
            No orders found matching the filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterOrders;
