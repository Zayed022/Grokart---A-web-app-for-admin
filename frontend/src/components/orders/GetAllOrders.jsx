import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ---------------------------------------------------------- */
/* 🔹 badge colours                                           */
/* ---------------------------------------------------------- */
const statusStyles = {
  Pending:           "bg-red-100    text-red-700",
  Assigned:          "bg-purple-100 text-purple-700",
  "Out for Delivery":"bg-amber-100  text-amber-700",
  Delivered:         "bg-green-100  text-green-700",
};

const payStyles = {
  Paid:   "bg-green-100 text-green-700",
  Unpaid: "bg-red-100   text-red-700",
};

/* ---------------------------------------------------------- */
/* 🔹 component                                               */
/* ---------------------------------------------------------- */
const GetAllOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ fetch orders ------------------------ */
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/get-orders",
        { withCredentials: true }
      );

      // newest first
      const sorted = [...data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ------------------ exports ----------------------------- */
  const exportToExcel = () => {
    /* map for cleaner column titles */
    const rows = orders.map(o => ({
      OrderID:       o._id,
      CustomerID:    o.customerId,
      Status:        o.status,
      TotalAmount:   o.totalAmount,
      Items:         o.items?.length || 0,
      PlacedOn:      format(new Date(o.createdAt), "dd-MMM-yyyy HH:mm"),
      PaymentMethod: o.paymentMethod,
      PayStatus:     o.paymentStatus ?? (o.isPaid ? "Paid" : "Unpaid"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const exportToPDF = () => {
    const input = document.getElementById("orders-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf     = new jsPDF("l", "mm", "a4");
      const width   = pdf.internal.pageSize.getWidth();
      const height  = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("orders.pdf");
    });
  };

  const csvHeaders = [
    { label: "Order ID",      key: "_id" },
    { label: "Customer ID",   key: "customerId" },
    { label: "Status",        key: "status" },
    { label: "Total",         key: "totalAmount" },
    { label: "Items",         key: "items.length" },
    { label: "Placed On",     key: "createdAt" },
    { label: "Payment",       key: "paymentMethod" },
    { label: "Pay Status",    key: "paymentStatus" },   // new column
  ];

  /* ------------------ UI states --------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        No orders found.
      </div>
    );
  }

  /* ------------------ render ------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🧾 All Orders ({orders.length})
        </h2>

        {/* -------- export buttons -------- */}
        <div className="flex gap-4 mb-6">
          <CSVLink
            data={orders}
            headers={csvHeaders}
            filename="orders.csv"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </CSVLink>

          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>

          <button
            onClick={exportToPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>

        {/* -------- table -------- */}
        <div className="overflow-x-auto">
          <table
            id="orders-table"
            className="min-w-full text-sm text-left"
          >
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3 whitespace-nowrap">Placed&nbsp;On</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Pay&nbsp;Status</th> {/* new col */}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {orders.map((o, idx) => {
                /* handle both paymentStatus and isPaid */
                const payStatus =
                  o.paymentStatus ?? (o.isPaid ? "Paid" : "Unpaid");

                return (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs">{o._id}</td>
                    <td className="px-4 py-3 text-xs">{o.customerId}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[o.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">₹{o.totalAmount}</td>

                    <td className="px-4 py-3">{o.items?.length || 0}</td>

                    <td className="px-4 py-3">
                      {format(new Date(o.createdAt), "dd MMM yyyy HH:mm")}
                    </td>

                    <td className="px-4 py-3 capitalize">{o.paymentMethod}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payStyles[payStatus] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GetAllOrders;
