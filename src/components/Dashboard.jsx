// src/pages/Dashboard.js
import React from 'react';
import OrderMonitor from './OrderMonitor';

const Dashboard = () => {
  // Dummy data
  const totalCategories = 5;
  const totalSubcategories = 12;
  const totalOrdersToday = 27;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Categories</h3>
          <p className="text-2xl font-bold">{totalCategories}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Subcategories</h3>
          <p className="text-2xl font-bold">{totalSubcategories}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold">Orders Today</h3>
          <p className="text-2xl font-bold">{totalOrdersToday}</p>
        </div>
        
      </div>
      <OrderMonitor/>
    </div>
  );
};

export default Dashboard;
