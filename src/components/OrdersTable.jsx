// src/components/Orders/OrdersTable.js
import React from 'react';

const OrdersTable = ({ orders }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 border-b">Order ID</th>
          <th className="px-4 py-2 border-b">Customer</th>
          <th className="px-4 py-2 border-b">Items</th>
          <th className="px-4 py-2 border-b">Total</th>
          <th className="px-4 py-2 border-b">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-100">
            <td className="px-4 py-2 border-b">{order.id}</td>
            <td className="px-4 py-2 border-b">{order.customer}</td>
            <td className="px-4 py-2 border-b">{order.items.join(', ')}</td>
            <td className="px-4 py-2 border-b">${order.total.toFixed(2)}</td>
            <td className="px-4 py-2 border-b">{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
