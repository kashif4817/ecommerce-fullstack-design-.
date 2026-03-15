import { Menu, ChevronDown } from 'lucide-react';

const CategoryBar = () => {
  return (
    <div className="w-full h-[56px] bg-white border-b border-gray-200 flex items-center">
      <div className="w-full max-w-[1180px] mx-auto flex items-center justify-between px-4">

        {/* Left Side */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors font-medium text-sm">
            <Menu size={18} />
            <span>All category</span>
          </button>
          <a href="#" className="text-sm text-gray-700 hover:text-blue-500 transition-colors">Hot offers</a>
          <a href="#" className="text-sm text-gray-700 hover:text-blue-500 transition-colors">Gift boxes</a>
          <a href="#" className="text-sm text-gray-700 hover:text-blue-500 transition-colors">Projects</a>
          <a href="#" className="text-sm text-gray-700 hover:text-blue-500 transition-colors">Menu item</a>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>Help</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>English, USD</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>Ship to</span>
            <img src="https://flagcdn.com/w40/de.png" alt="Germany" className="w-5 h-3.5 object-cover rounded-sm" />
            <ChevronDown size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryBar;