"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-full bg-white border-b border-gray-200">
      <div className="w-full max-w-[1180px] mx-auto flex items-center justify-between px-4 h-[56px] gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors font-medium text-sm">
            <Menu size={18} />
            <span>All category</span>
          </button>

          <Link
            href="/products"
            className={`text-sm transition-colors ${
              pathname === "/products"
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            All products
          </Link>

          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-500 transition-colors"
          >
            Hot offers
          </a>
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-500 transition-colors"
          >
            Gift boxes
          </a>
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-500 transition-colors"
          >
            Projects
          </a>
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-500 transition-colors"
          >
            Menu item
          </a>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>Help</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>English, USD</span>
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-500 transition-colors">
            <span>Ship to</span>
            <img
              src="https://flagcdn.com/w40/de.png"
              alt="Germany"
              className="w-5 h-3.5 object-cover rounded-sm"
            />
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
