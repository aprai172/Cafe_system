import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const OrderMonitor = () => {
  const [status, setStatus] = useState("Disconnected");
  const [orders, setOrders] = useState([]);
  const [log, setLog] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50X2lkIjoxLCJleHAiOjE3Njg1MzQxNjl9.W8Ru9IBYujkbL3O-KUQednS9THYm4-bjpR3W1QFO5ZM";

  useEffect(() => {
    const socket = io("https://menu-order-system.onrender.com", {
      query: { token },
    });

    socket.on("connect", () => {
      setStatus("Connected");
      console.log("Connected to server");
      socket.emit("test");
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
      console.log("Disconnected from server");
    });

    socket.on("test_response", (data) => {
      addToLog(`Test response received: ${JSON.stringify(data)}`);
    });

    socket.on("new_order", (order) => {
      addToLog(`New order received: ${JSON.stringify(order)}`);
      saveOrder(order);
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    loadOrders();

    return () => {
      socket.disconnect();
    };
  }, []);

  const addToLog = (message) => {
    setLog((prevLog) => [
      { message, time: new Date().toLocaleTimeString() },
      ...prevLog,
    ]);
  };

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  };

  const saveOrder = (order) => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [order, ...savedOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = async (orderId, orderNumber, status) => {
    try {
      const response = await fetch(
        "https://menu-order-system.onrender.com/admin/order/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: orderId, order_number: orderNumber, status }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        addToLog(`Order ${status} successfully.`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== orderId)
        );
      } else {
        console.error("Error updating order status:", result);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  console.log(orders);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Order Monitor</h2>
      <div className="text-center mb-6">
        <span
          className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          Connection status: {status}
        </span>
      </div>
      <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Logs</h3>
        {log.length === 0 ? (
          <p className="text-gray-500 text-sm">No logs available</p>
        ) : (
          log.map((entry, index) => (
            <div key={index} className="text-gray-700 text-sm">
              {`${entry.time}: ${entry.message}`}
            </div>
          ))
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white border border-gray-300 shadow-md rounded-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Order Number: {order.order_number}
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Customer:</strong> {order.customer_name}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Total Amount:</strong> ${order.total_amount}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Items:</strong>
            </p>
            <ul className="text-gray-600 text-sm list-disc pl-5">
              {order.items.map((item, index) => (
                <li key={index}>{item.item_name}</li>
              ))}
            </ul>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() =>
                  updateOrderStatus(order.order_id, order.order_number, "accepted")
                }
                className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  updateOrderStatus(order.order_id, order.order_number, "rejected")
                }
                className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderMonitor;
