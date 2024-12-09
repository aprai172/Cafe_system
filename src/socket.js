import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io("https://menu-order-system.onrender.com/", { query: { token } });
    socket.on("connect", () => console.log("Connected to WebSocket"));
    socket.on("disconnect", () => console.log("Disconnected from WebSocket"));
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};
