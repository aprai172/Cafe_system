import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const OrderMonitor = () => {
  const [status, setStatus] = useState("Disconnected");
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [log, setLog] = useState([]);
  const [paymentMode, setPaymentMode] = useState({});
  const [paymentNotes, setPaymentNotes] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50X2lkIjoxLCJleHAiOjE3NzA3OTkwOTJ9.eoJs4rfE_Jva59jH_Ed7PSrEGdZZg7wCdhfx_-Ky-iM";

  useEffect(() => {
    const socket = io("https://menuordersystem-production.up.railway.app/", {
      query: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
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

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("test_response", (data) => {
      addToLog(`Test response received: ${JSON.stringify(data)}`);
    });

    socket.on("new_order", (order) => {
      addToLog(`New order received: ${JSON.stringify(order)}`);
      setReceivedOrders((prevOrders) => [order, ...prevOrders]);
    });

    loadAcceptedOrders();

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

  const loadAcceptedOrders = () => {
    const savedAcceptedOrders =
      JSON.parse(localStorage.getItem("acceptedOrders")) || [];
    setAcceptedOrders(savedAcceptedOrders);
  };

  const saveAcceptedOrders = (orders) => {
    localStorage.setItem("acceptedOrders", JSON.stringify(orders));
  };

  const updateOrderStatus = async (orderId, orderNumber, status) => {
    try {
      const response = await axios.post(
        "https://menuordersystem-production.up.railway.app/admin/order/confirm",
        {
          order_id: orderId,
          order_number: orderNumber,
          status,
        }
      );

      if (response.status === 200) {
        addToLog(`Order ${status} successfully.`);
        if (status === "accepted") {
          const orderToMove = receivedOrders.find(
            (order) => order.order_id === orderId
          );
          if (orderToMove) {
            const updatedAcceptedOrders = [orderToMove, ...acceptedOrders];
            setAcceptedOrders(updatedAcceptedOrders);
            saveAcceptedOrders(updatedAcceptedOrders);
          }
          setReceivedOrders((prevOrders) =>
            prevOrders.filter((order) => order.order_id !== orderId)
          );
        } else {
          setReceivedOrders((prevOrders) =>
            prevOrders.filter((order) => order.order_id !== orderId)
          );
        }
      } else {
        console.error("Error updating order status:", response.data);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updatePaymentStatus = async (orderId, orderNumber) => {
    const mode = paymentMode[orderId];
    const notes = paymentNotes[orderId] || "";

    if (!mode) {
      setStatusMessage("Please select a payment mode before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        "https://menuordersystem-production.up.railway.app/admin/order/payment",
        {
          order_id: orderId,
          order_number: orderNumber,
          status: "paid",
          payment_mode: mode,
          payment_notes: notes,
        }
      );

      if (response.status === 200) {
        setStatusMessage("Payment updated successfully.");
        addToLog(`Payment updated for order ${orderNumber}.`);
      } else {
        setStatusMessage("Failed to update payment. Try again.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setStatusMessage("An error occurred while updating payment.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Order Monitor
      </h2>
      <div className="text-center mb-6">
        <span
          className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
            status === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          Connection status: {status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Received Orders</h3>
          {receivedOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No received orders</p>
          ) : (
            receivedOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4"
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
            ))
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Accepted Orders</h3>
          {acceptedOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No accepted orders</p>
          ) : (
            acceptedOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white border border-gray-300 shadow-md rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-800">
                    Order <span className="text-blue-500">#{order.order_number}</span>
                  </h4>
                  <p className="text-xs text-gray-600">
                    <strong>Total:</strong>{" "}
                    <span className="font-medium text-green-500">${order.total_amount}</span>
                  </p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-600">
                    <strong>Customer:</strong> {order.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>ID:</strong> {order.order_id}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-700 font-semibold mb-1">Items:</p>
                  <ul className="text-gray-600 text-xs list-disc pl-4">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.item_name}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-700 font-semibold mb-1">Payment Method:</p>
                  <div className="flex space-x-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`payment-${order.order_id}`}
                        value="cash"
                        className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-400"
                        onChange={(e) =>
                          setPaymentMode((prev) => ({
                            ...prev,
                            [order.order_id]: e.target.value,
                          }))
                        }
                      />
                      <span className="ml-2 text-xs text-gray-700">Cash</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`payment-${order.order_id}`}
                        value="online"
                        className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-400"
                        onChange={(e) =>
                          setPaymentMode((prev) => ({
                            ...prev,
                            [order.order_id]: e.target.value,
                          }))
                        }
                      />
                      <span className="ml-2 text-xs text-gray-700">Online</span>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-700 font-semibold mb-1">Note (Optional):</p>
                  <textarea
                    name={`note-${order.order_id}`}
                    placeholder="Add a note (optional)"
                    className="w-full p-2 border border-gray-300 rounded-md text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    rows={2}
                    onChange={(e) =>
                      setPaymentNotes((prev) => ({
                        ...prev,
                        [order.order_id]: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
                <button
                  onClick={() => updatePaymentStatus(order.order_id, order.order_number)}
                  className="bg-blue-500 text-white rounded px-4 py-2 mt-3 hover:bg-blue-600"
                >
                  Submit Payment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {statusMessage && (
        <div className="mt-4 text-center text-sm text-red-500">{statusMessage}</div>
      )}
    </div>
  );
};

export default OrderMonitor;
