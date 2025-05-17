import React, { useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`https://grokart-2.onrender.com/api/v1/users/search?query=${query}`);
      setUsers(data.users);
    } catch (error) {
      console.error("Search error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">🔍 Search Users</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by ID, name, email, or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-600"><strong>Phone:</strong> {user.phone}</p>
              <p className="text-gray-600">
                <strong>Role:</strong>{" "}
                {user.isAdmin
                  ? "Admin"
                  : user.isDeliveryPartner
                  ? "Delivery Partner"
                  : "Customer"}
              </p>
              <p className="text-gray-600">
                <strong>Verified:</strong> {user.isVerified ? "Yes ✅" : "No ❌"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 mt-6">No users found.</p>
        )
      )}
    </div>
  );
};

export default SearchUser;
