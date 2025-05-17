import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://grokart-2.onrender.com/api/v1/admin/get-products",
        { withCredentials: true }
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch Products", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  const exportToPDF = () => {
    const input = document.getElementById("products-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("products.pdf");
    });
  };

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "ID", key: "_id" },
    { label: "Description", key: "description" },
    { label: "Price", key: "price" },
    { label: "Category", key: "category" },
    { label: "Subcategory", key: "subCategory" },
    { label: "Minicategory", key: "miniCategory" },
    { label: "Stock", key: "stock" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-7xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Products
        </h1>

        <div className="flex gap-4 mb-6">
          <CSVLink
            data={products}
            headers={csvHeaders}
            filename="products.csv"
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

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table
              id="products-table"
              className="min-w-full border rounded-xl overflow-hidden text-sm text-left text-gray-700"
            >
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subcategory</th>
                  <th className="px-4 py-3">Minicategory</th>
                  <th className="px-4 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={product._id} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product._id}</td>
                    <td className="px-4 py-3">{product.description}</td>
                    <td className="px-4 py-3">{product.price}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.subCategory}</td>
                    <td className="px-4 py-3">{product.miniCategory}</td>
                    <td className="px-4 py-3">{product.stock}</td>
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

export default GetProducts;
