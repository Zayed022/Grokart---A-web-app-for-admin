// src/pages/products/ProductPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { title: 'Get Registered Delivery Partner(Not Approved)', path: '/delivery/registered' },
  { title: 'Approve Delivery Partner', path: '/delivery/approve' },
  { title: 'Get All Delivery Partners', path: '/delivery/get-all-DP' },
  { title: 'Get Available Delivery Partners', path: '/delivery/get-availableDP' },
  { title: 'Search Delivery Partner By Id, Name', path: '/delivery/search' },
  { title: 'Get Completed Orders By a Delivery Partner', path: '/delivery/completed-orders' },
  { title: 'Get Daily Collection of a Delivery Partner', path: '/delivery/collection' },
  { title: 'Get Daily Earnings of Delivery Partner ', path: '/delivery/earnings' },
  { title: 'Get All-TimeEarnings of Delivery Partner ', path: '/delivery/all-time-earnings' },
  { title: 'Get All Orders Delivered by Time ', path: '/delivery/orders-time' },
  { title: 'Get Delivery Reports ', path: '/delivery/reports' },
  
];

const DeliveryPartner = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Delivery Partner Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            className="cursor-pointer group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="text-sm text-gray-400 mb-1 group-hover:text-indigo-500 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="text-lg font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
              {action.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPartner;
