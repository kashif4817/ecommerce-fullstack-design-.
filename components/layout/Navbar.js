import React from 'react';
import { User, MessageSquare, Heart, ShoppingCart, ChevronDown } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full h-[86px] bg-white border-b border-gray-200 flex items-center">
      <div className="w-full max-w-[1180px] mx-auto flex items-center justify-between px-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-blue-400">Brand</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border-2 border-blue-500 rounded-lg overflow-hidden flex-1 mx-8 max-w-[600px]">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 px-4 py-2.5 outline-none text-gray-600 placeholder-gray-400 text-sm"
          />
          <div className="flex items-center gap-2 border-l border-blue-500 px-4 py-2.5 cursor-pointer bg-white shrink-0">
            <span className="text-sm text-gray-700 whitespace-nowrap">All category</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-2.5 text-sm font-medium transition-colors shrink-0">
            Search
          </button>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-6 shrink-0">
          {[
            { Icon: User, label: 'Profile' },
            { Icon: MessageSquare, label: 'Message' },
            { Icon: Heart, label: 'Orders' },
            { Icon: ShoppingCart, label: 'My cart' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center cursor-pointer group">
              <Icon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;