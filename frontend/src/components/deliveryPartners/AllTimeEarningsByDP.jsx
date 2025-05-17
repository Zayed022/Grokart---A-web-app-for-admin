import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PAGE_SIZE = 12; // cards per page

const AllTimeEarningsByDP = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchAllTimeEarnings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/all-time-earnings",
        { withCredentials: true }
      );
      setEarnings(data.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch earnings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTimeEarnings();
  }, []);

  /* ---------- EXPORT HELPERS ---------- */
  const csvHeaders = [
    { label: "Partner ID", key: "partnerId" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Orders", key: "orderCount" },
    { label: "Base ₹", key: "baseEarnings" },
    { label: "Incentive ₹", key: "incentives" },
    { label: "Total ₹", key: "totalEarnings" },
  ];

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(earnings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All-Time Earnings");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "earnings.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "l" });
    doc.text("All-Time Earnings – Delivery Partners", 14, 10);
    doc.autoTable({
      head: [csvHeaders.map(h => h.label)],
      body: earnings.map(e => [
        e.partnerId,
        e.name,
        e.email,
        e.phone,
        e.orderCount,
        e.baseEarnings,
        e.incentives,
        e.totalEarnings,
      ]),
      styles: { fontSize: 7 },
      startY: 16,
    });
    doc.save("earnings.pdf");
  };

  /* ---------- PAGINATION ---------- */
  const lastPage = Math.ceil(earnings.length / PAGE_SIZE);
  const paginated = earnings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📈 All-Time Earnings – Delivery Partners
          </h2>

          {!loading && earnings.length > 0 && (
            <div className="space-x-2">
              <CSVLink
                filename="earnings.csv"
                headers={csvHeaders}
                data={earnings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                CSV
              </CSVLink>
              <button
                onClick={exportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
              >
                Excel
              </button>
              <button
                onClick={exportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
              >
                PDF
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading earnings...</p>
        ) : earnings.length === 0 ? (
          <p className="text-center text-gray-500">
            No earnings data available.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginated.map((dp) => (
                <div
                  key={dp.partnerId}
                  className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {dp.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Phone:</strong> {dp.phone}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> {dp.email}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold mb-1">
                    Orders Delivered: {dp.orderCount}
                  </p>
                  <p className="text-sm text-green-700 font-medium mb-1">
                    Base Earnings: ₹{dp.baseEarnings}
                  </p>
                  <p className="text-sm text-yellow-600 font-medium mb-1">
                    Incentives: ₹{dp.incentives}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    Total: ₹{dp.totalEarnings}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {page} of {lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
                  disabled={page === lastPage}
                  className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTimeEarningsByDP;
