// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Mainfile = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 overflow-auto">
          <Outlet /> {/* Renders whatever child route is active */}
        </main>
      </div>
    </div>
  );
};

export default Mainfile;
