// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Bike,
  Tag,
  Settings,
  Heart,
  Image,
  Megaphone
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={30} />, to: '/' },
    { name: 'Products', icon: <Package size={30} />, to: '/products' },
    { name: 'Orders', icon: <ShoppingCart size={30} />, to: '/orders' },
    { name: "Wishlist", icon: <Heart size={30} />, to: "/wishlist" },
    { name: 'Users', icon: <Users size={30} />, to: '/users' },
    { name: 'Delivery Partners', icon: <Bike size={30} />, to: '/delivery-partners' },
    { name: 'Shop', icon: <Package size={30} />, to: '/shop' },
    { name: 'Banner', icon: <Image size={30} />, to: '/banner' },
    { name: 'Notice', icon: <Megaphone size={30} />, to: '/notice' },
    { name: 'Offers', icon: <Tag size={30} />, to: '/offers' },
    { name: 'Settings', icon: <Settings size={30} />, to: '/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md border-r border-gray-200 py-6 px-4">
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
              ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'}`
            }
          >
            {item.icon}
            <span className='text-xl '>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
