import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SearchShop = () => {
  const [query, setQuery] = useState("");
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning("Please enter a valid search term");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://grokart-2.onrender.com/api/v1/shop/search?query=${query}`,
        { withCredentials: true }
      );
      setShop(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("No shop found or something went wrong.");
      setShop([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Search Shop</h2>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter ID, Name, or Email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-center text-gray-500">Searching...</p>}

        {!loading && shop.length > 0 && (
          <div className="space-y-6">
            {shop.map((dp) => (
              <div
                key={dp._id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                <p><strong>Name:</strong> {dp.name}</p>
                <p><strong>Email:</strong> {dp.email}</p>
                <p><strong>Phone:</strong> {dp.phone}</p>
               
                
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchShop;
