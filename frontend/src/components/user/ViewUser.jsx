import React, { useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const ViewUser = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setUser(null);
    setNotFound(false);
    try {
      const { data } = await axios.get(`https://grokart-2.onrender.com/api/v1/users/account-info?query=${query}`);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">View User Account Info</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ID, name, or email"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? <LoaderCircle className="animate-spin h-5 w-5" /> : "Search"}
        </button>
      </div>

      {user && (
        <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Last Login:</strong> {user.lastLogin !== "N/A" ? new Date(user.lastLogin).toLocaleString() : "N/A"}</p>
        </div>
      )}

      {notFound && !loading && (
        <p className="text-sm text-center text-red-500 mt-4">User not found.</p>
      )}
    </div>
  );
};

export default ViewUser;
