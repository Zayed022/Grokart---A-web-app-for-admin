import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetAllShop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/shop/get-all-shops",
        { withCredentials: true }
      );
      setShops(response.data.data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
      toast.error("Error fetching shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Shops
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : shops.length === 0 ? (
          <div className="text-center text-gray-600">No shops found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shops.map((shop, index) => (
                  <tr key={shop._id} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">{shop.name}</td>
                     <td className="px-4 py-3">{shop._id}</td>
                    <td className="px-4 py-3">{shop.email}</td>
                    <td className="px-4 py-3">{shop.phone}</td>
                    <td className="px-4 py-3">
                      {shop.isApproved ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllShop;
