import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/users/get-all-users",
        { withCredentials: true }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Users
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-600">No users found.</div>
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
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">{user.name}</td>
                     <td className="px-4 py-3">{user._id}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    
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

export default GetAllUsers;
