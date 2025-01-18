// src/pages/OrdersPage.js
import React, { useState } from 'react';
import OrdersTable from './OrdersTable';

const OrdersPage = () => {
  // Dummy orders
  const [orders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      items: ['Espresso', 'Croissant'],
      total: 8.50,
      status: 'Received'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      items: ['Latte'],
      total: 3.50,
      status: 'Received'
    },
    {
      id: 3,
      customer: 'Bob Ross',
      items: ['Cappuccino', 'Bagel'],
      total: 10.00,
      status: 'Preparing'
    }
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      <OrdersTable orders={orders} />
    </div>
  );
};

export default OrdersPage;
