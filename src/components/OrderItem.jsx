import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { initializeSocket } from "../socket";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN0YXVyYW50X2lkIjoxLCJleHAiOjE3Njg1MzQxNjl9.W8Ru9IBYujkbL3O-KUQednS9THYm4-bjpR3W1QFO5ZM";
initializeSocket(token);

const submitOrder = async (orderData) => {
  try {
    const response = await axios.post(
      "https://menu-order-system.onrender.com/customer/order",
      orderData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An unexpected error occurred.";
  }
};

const OrderItemPage = ({ addedItems, handleRemove, setShowOrderPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true); // Control popup visibility
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleOrderSubmit = async () => {
    if (addedItems.length === 0) {
      toast.warn("No items in your order to submit!");
      return;
    }

    const userId = uuidv4();
    const orderData = {
      user_id: userId,
      restaurant_id: 1,
      customer_name: username,
      customer_email: email,
      items: addedItems.map((item) => ({
        item_id: item.key,
        item_name: item.name,
        quantity: item.quantity,
        price: item.quantity * item.price,  
      })),
    };

    try {
      setIsLoading(true);
      const response = await submitOrder(orderData);
      navigate(`/waiting_screen?user_id=${response.user_id}&order_number=${response.ordernumber}`,{state:orderData});
      toast.info("Order submitted successfully! Waiting for admin approval...");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupSubmit = () => {
    if (!username || !email) {
      toast.warn("Please fill out both fields!");
      return;
    }
    setShowPopup(false);
  };

  return (
    <div
      className="min-h-screen p-4 relative"
      style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
    >
      <ToastContainer />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-md"
            />
            <button
              onClick={handlePopupSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {!showPopup && (
        <>
          <header className="bg-white shadow-lg rounded-lg p-4 mb-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Order Summary</h1>
            <p className="text-sm text-gray-500">Review your selected items</p>
          </header>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Order</h2>
            {addedItems.length === 0 ? (
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Empty Cart"
                  className="w-24 mx-auto mb-4"
                />
                <p className="text-gray-500">Your cart is empty!</p>
                <button
                  onClick={() => setShowOrderPage(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mt-4"
                >
                  Add Items
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {addedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-lg p-4 shadow-md bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src="https://via.placeholder.com/50"
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-700 font-bold">
                          ₹{item.quantity * 120}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.key)}
                      className="bg-red-500 text-white px-4 py-1 text-sm rounded-lg shadow hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowOrderPage(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Go Back
            </button>
            <button
              onClick={handleOrderSubmit}
              className={`${
                isLoading ? "bg-gray-500" : "bg-green-500"
              } text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 ml-4`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderItemPage;
