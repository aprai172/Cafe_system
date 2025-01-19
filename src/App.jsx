import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderForm from "./components/MenuPage";
import OrderStatus from "./components/OrderStatus";
import OrderMonitor from "./components/OrderMonitor";
import Qrcode from "./OrderForm";
import BillPage from "./components/BIllPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/layout/Mainfile";
import MenuManagementPage from "./components/MenuManagementPage";
import OrdersPage from "./components/OrdersPage";
import BarcodePage from "./components/BarcodePage";

const App = () => {
  return (
    <Router>
    <Routes>
      {/* FRONT-FACING ROUTES (NO LAYOUT) */}
      <Route path="/MENU" element={<OrderForm />} />
      <Route path="/waiting_screen" element={<OrderStatus />} />
      <Route path="/monitor" element={<OrderMonitor />} />
      <Route path="/qrcode" element={<Qrcode />} />
      <Route path="/bill" element={<BillPage />} />

      {/* ADMIN ROUTES (WITH LAYOUT) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu-management" element={<MenuManagementPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/barcode" element={<BarcodePage />} />
      </Route>
    </Routes>
  </Router>
  );
};

export default App;
