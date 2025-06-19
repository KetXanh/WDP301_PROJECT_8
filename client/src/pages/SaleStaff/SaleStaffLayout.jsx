import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

const SaleStaffLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SaleStaffLayout; 