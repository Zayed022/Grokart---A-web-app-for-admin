import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExportOrders = () => {
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
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const exportOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/admin/export-orders",
        { ...filters, format },
        {
          responseType: "blob", // important for file download
        }
      );

      // Create a link to download file
      const blob = new Blob([response.data], {
        type:
          format === "csv"
            ? "text/csv"
            : format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `orders_export_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.${
          format === "excel" ? "xlsx" : format
        }`
      );

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Export successful!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to export orders. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-8 bg-white rounded-lg shadow-lg min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
        Export Orders Data
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <input
          type="text"
          name="paymentStatus"
          placeholder="Payment Status"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="status"
          placeholder="Order Status"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="date"
          name="endDate"
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="number"
          name="minAmount"
          placeholder="Min Amount"
          onChange={handleChange}
          className="input-field"
          min={0}
        />
        <input
          type="number"
          name="maxAmount"
          placeholder="Max Amount"
          onChange={handleChange}
          className="input-field"
          min={0}
        />

        {/* Format Selector */}
        <div className="flex flex-col justify-end">
          <label className="mb-2 font-semibold text-gray-700">
            Select Export Format
          </label>
          <select
            value={format}
            onChange={handleFormatChange}
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={exportOrders}
          disabled={loading}
          className={`inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
            loading ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Exporting...
            </>
          ) : (
            "Export Orders"
          )}
        </button>
      </div>

      {/* Inline Tailwind CSS for inputs */}
      <style>{`
        .input-field {
          border: 1.5px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        .input-field::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ExportOrders;
