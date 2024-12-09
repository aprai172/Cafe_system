import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderForm from "./components/MenuPage";
import OrderStatus from "./components/OrderStatus";
import OrderMonitor from "./components/OrderMonitor";
import Qrcode from "./OrderForm";
import BillPage from "./components/BIllPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/waiting_screen" element={<OrderStatus/>} />
        <Route path="/monitor" element={<OrderMonitor />} />
        <Route path="/qrcode" element={<Qrcode />} />
        <Route path="/bill" element={<BillPage/>} />

      </Routes>
    </Router>
  );
};

export default App;
