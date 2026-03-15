'use client'
import { ChevronRight } from 'lucide-react';

const MainSection = () => {
  const categories = [
    'Automobiles',
    'Clothes and wear',
    'Home interiors',
    'Computer and tech',
    'Tools, equipments',
    'Sports and outdoor',
    'Animal and pets',
    'Machinery tools',
    'More category',
  ];

  return (
    <section className="w-[1180px] h-[400px] mx-auto flex gap-0 overflow-hidden">

      {/* Left Sidebar - Categories */}
      <div className="w-[200px] shrink-0 bg-white border border-[#DEE2E7] overflow-hidden">
        <ul className="divide-y divide-gray-100 h-full">
          {categories.map((category, index) => (
            <li key={index}>

              <a
                href="#"
                className="flex items-center justify-between px-4 py-[11px] hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              >
                <span className="text-sm">{category}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Center - Main Banner */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-r from-teal-300 to-cyan-200 mx-3">
        <div className="absolute inset-0 flex flex-col justify-center pl-10 z-10">
          <p className="text-teal-700 text-sm mb-1">Latest trending</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">Electronic<br />items</h2>
          <button className="bg-white text-gray-800 px-5 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors w-fit">
            Learn more
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
          alt="Electronic items"
          className="absolute right-0 top-0 h-full w-[60%] object-cover"
        />
      </div>

      {/* Right Side - User + Promo cards */}
      <div className="w-[200px] shrink-0 flex flex-col gap-3">

        {/* User card */}
        <div className="bg-white border border-[#DEE2E7] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Hi, user</p>
              <p className="text-xs text-gray-400 leading-tight">let's get stated</p>
            </div>
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 rounded transition-colors font-medium">
            Join now
          </button>
          <button className="w-full border border-blue-500 text-blue-500 text-sm py-1.5 rounded hover:bg-blue-50 transition-colors font-medium">
            Log in
          </button>
        </div>

        {/* Orange promo */}
        <div className="bg-[#FF8C00] p-4 flex-1 flex items-center">
          <p className="text-white text-sm font-medium leading-snug">
            Get US $10 off<br />with a new<br />supplier!
          </p>
        </div>

        {/* Teal promo */}
        <div className="bg-[#00B8D9] p-4 flex-1 flex items-center">
          <p className="text-white text-sm font-medium leading-snug">
            Send quotes with<br />supplier preferences
          </p>
        </div>

      </div>

    </section>
  );
};

export default MainSection;