import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSocket } from "../socket";
import { Grid } from "react-loader-spinner";

const OrderStatus = () => {
  const [message, setMessage] = useState("Waiting for order confirmation...");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user_id");
  const orderNumber = queryParams.get("order_number");
  const data = location.state;

  // console.log(data);

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join_order_room", { order_number: orderNumber, user_id: userId });

    socket.on("order_status_update", (data) => {
      if (data.order_number === orderNumber && data.user_id === userId) {
        setMessage(data.status === "accepted" ? "Order Accepted!" : "Order Rejected!");
        
      
      }
    });

    return () => {
      socket.off("order_status_update");
    };
  }, [orderNumber, userId, navigate, location.state]);

  if (message === "Order Accepted!") {
    setTimeout(() => {
      navigate("/bill", { state: data });
    }, 3000);
  }



  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <Grid
  visible={true}
  height="80"
  width="80"
  color="#4fa94d"
  ariaLabel="grid-loading"
  radius="12.5"
  wrapperStyle={{}}
  wrapperClass="grid-wrapper"
  />
      <h2 className="text-2xl font-bold mb-4 mt-4">Order Status</h2>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default OrderStatus;
