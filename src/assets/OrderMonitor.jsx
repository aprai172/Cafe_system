import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const OrderMonitor = () => {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [logMessages, setLogMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50X2lkIjoxLCJleHAiOjE3Njg3MjgwODN9.FcqOmnYp3NO25mUhlAwxl-F09p1c4HcUGppfyHeeyM4";

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);

    const socket = io("https://menu-order-system.onrender.com", {
      query: { token: token },
    });

    socket.on("connect", () => {
      setConnectionStatus("Connected");
      addToLog("Connected to server.");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      addToLog("Disconnected from server.");
    });

    socket.on("new_order", (order) => {
      addToLog(`New order received: ${JSON.stringify(order)}`);
      saveOrder(order);
      setOrders((prevOrders) => [{ ...order, status: "New" }, ...prevOrders]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const addToLog = (message) => {
    const logEntry = { time: new Date().toLocaleTimeString(), message };
    setLogMessages((prevMessages) => [logEntry, ...prevMessages]);
  };

  const saveOrder = (order) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [{ ...order, status: "New" }, ...orders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = async (orderId, orderNumber, status) => {
    const apiStatus = status.toLowerCase();
    try {
      const response = await fetch(
        "https://menu-order-system.onrender.com/admin/order/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: orderId, order_number: orderNumber, status: apiStatus }),
        }
      );

      if (response.ok) {
        const updatedOrders = orders.map((order) =>
          order.order_id === orderId ? { ...order, status: status } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        addToLog(`Order ${orderId} marked as ${status}`);

        // Emit order status update via WebSocket
        const socket = io("https://menu-order-system.onrender.com", {
          query: { token: token },
        });
        socket.emit("order_status_update", {
          order_number: orderNumber,
          user_id: orders.find((order) => order.order_id === orderId)?.customer_id,
          status: status,
        });
      } else {
        const error = await response.json();
        addToLog(`Failed to update order ${orderId}: ${error.message}`);
      }
    } catch (error) {
      addToLog(`Error updating order ${orderId}: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Monitor</h1>

      <div
        className={`p-4 rounded-lg mb-6 text-white ${
          connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        Connection status: {connectionStatus}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Activity Log</h2>
        <div className="border border-gray-200 p-4 rounded-lg h-64 overflow-y-auto">
          {logMessages.length > 0 ? (
            logMessages.map((log, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 mb-2 border-b pb-2"
              >
                <span className="font-semibold text-gray-800">
                  {log.time}:
                </span>{" "}
                {log.message}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No logs to display.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Orders</h2>
        <div className="border border-gray-200 p-4 rounded-lg h-64 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="p-4 mb-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-sm">
                  <strong>Order Number:</strong> {order.order_number}
                </p>
                <p className="text-sm">
                  <strong>Order ID:</strong> {order.order_id}
                </p>
                <p className="text-sm">
                  <strong>Customer:</strong> {order.customer_name}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      order.status === "New"
                        ? "text-blue-500"
                        : order.status === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm">
                  <strong>Total Amount:</strong> ${order.total_amount}
                </p>
                <p className="text-sm">
                  <strong>Items:</strong> {order.items.length}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, order.order_number, "Accepted")
                    }
                    className="bg-green-500 text-white px-4 py-1 rounded-lg shadow hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(order.order_id, order.order_number, "Rejected")
                    }
                    className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No orders to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderMonitor;
