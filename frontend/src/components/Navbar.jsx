// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, RefreshCcw } from 'lucide-react';
import Grokart from "../assets/Grokart.png"

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-10 py-10 sticky top-0 z-50">
      
      {/* Logo & Brand Name */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
        <img src={Grokart} alt="GroKart Logo" className="h-10 w-auto object-contain" />
        
      </Link>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <RefreshCcw size={16} /> Refresh
        </button>

      <Link to = "/logout">
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          <LogOut size={16} /> Logout
        </button>
        </Link> 
      </div>
    </nav>
  );
};

export default Navbar;
