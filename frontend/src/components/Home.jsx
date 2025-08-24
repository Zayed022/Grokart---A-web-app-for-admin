// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import GetPlacedOrder from './orders/GetPlacedOrders';

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <HeroSection />
          <GetPlacedOrder/>
        </main>
      </div>
    </div>
  );
};

export default Home;
