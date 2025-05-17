
import React, { useState } from 'react';
import axios from 'axios';

const DeliveryReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://grokart-2.onrender.com/api/v1/admin/report`, {
        params: {
          startDate,
          endDate,
          deliveryPartnerId: partnerId,
        },
      });
      setReport(data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-semibold">Delivery Partner Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Delivery Partner ID (optional)"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={fetchReport}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Fetching...' : 'Generate Report'}
      </button>

      {report && (
        <div className="mt-6 space-y-3">
          <p><strong>Total Orders:</strong> {report.totalOrders}</p>
          <p><strong>Total Earnings:</strong> ₹{report.totalEarnings}</p>
          <p><strong>Average Delivery Time:</strong> {report.avgDeliveryTime} min</p>

          <h2 className="text-lg font-semibold mt-4">Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Placed At</th>
                  <th className="px-4 py-2">Delivered At</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{new Date(order.placedAt).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(order.deliveredAt).toLocaleString()}</td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryReports;
