import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetAllAvailableDP = () => {
  const [availablePartners, setAvailablePartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAvailablePartners = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/delivery/available",
        { withCredentials: true }
      );
      setAvailablePartners(response.data.data);
    } catch (error) {
      console.error("Error fetching available delivery partners", error);
      toast.error("Failed to fetch available delivery partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailablePartners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Available Delivery Partners
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : availablePartners.length === 0 ? (
          <div className="text-center text-gray-600">No available partners found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-xl overflow-hidden text-sm text-left text-gray-700">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availablePartners.map((partner, index) => (
                  <tr key={partner._id} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{partner._id}</td>
                    <td className="px-4 py-3">{partner.name}</td>
                    <td className="px-4 py-3">{partner.email}</td>
                    <td className="px-4 py-3">{partner.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Available
                      </span>
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

export default GetAllAvailableDP;
