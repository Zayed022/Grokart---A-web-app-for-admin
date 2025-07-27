import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RegisteredShop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegisteredShops = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/shop/registered",
        { withCredentials: true }
      );
      setShops(response.data.data || []);
    } catch (error) {
      console.error("Error fetching registered shops:", error);
      toast.error(
        error.response?.data?.message || "Failed to load registered shops"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredShops();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Registered Shops
        </h1>
        <p className="text-gray-600 mb-6">
          These shops have registered but are not yet approved.
        </p>

        {loading ? (
          <div className="text-center py-10 text-blue-500 text-lg font-medium">
            Loading...
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium">
            No unapproved shops found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border rounded-xl overflow-hidden">
                <thead className="bg-blue-600 text-white text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Registered At</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {shops.map((dp) => (
                    <tr
                      key={dp._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{dp.name}</td>
                      <td className="px-4 py-3">{dp._id}</td>
                      <td className="px-4 py-3">{dp.email}</td>
                      <td className="px-4 py-3">{dp.phone}</td>
                      <td className="px-4 py-3">
                        {new Date(dp.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Total Registered (Unapproved) Shops:{" "}
              <span className="font-semibold">{shops.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisteredShop;
