import React from "react";
import { useLocation } from "react-router-dom";

const BillPage = () => {
  const location = useLocation();
  const  orderDetails  = location.state || {};

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">No order details found.</p>
      </div>
    );
  }

  const { customer_name, customer_email, items } = orderDetails;
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bill Summary</h1>
          <p className="text-sm text-gray-500">Thank you for your order!</p>
        </header>

        {/* Customer Details */}
        <div className="border-b border-gray-300 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Customer Details</h2>
          <p className="text-sm text-gray-600">
            <strong>Name:</strong> {customer_name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {customer_email || "N/A"}
          </p>
        </div>

        {/* Order Details */}
        <div className="border-b border-gray-300 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Details</h2>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow"
              >
                <div>
                  <p className="text-gray-800 font-medium">{item.item_name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-gray-700 font-semibold">₹{item.price}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">Total: ₹{totalAmount}</h2>
        </div>

        {/* Download Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => alert("Download feature coming soon!")}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600"
          >
            Download Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
