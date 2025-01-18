// src/components/Layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h1 className="text-xl font-bold mb-4">Café Admin</h1>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-700"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/menu-management"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-700"
          }
        >
          Menu Management
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-700"
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/barcode"
          className={({ isActive }) =>
            isActive ? "font-semibold text-blue-600" : "text-gray-700"
          }
        >
          Barcode Generator
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
