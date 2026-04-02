import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white font-sans text-gray-600 border-t border-gray-200 w-full">
      <div className="max-w-[1180px] mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6 lg:gap-8">

          {/* Brand and Description — responsive columns */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-500 p-1.5 sm:p-2 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-400">Brand</span>
            </div>
            <p className="text-gray-500 mb-4 sm:mb-6 max-w-xs text-sm sm:text-base">
              Best information about the company gies here but now lorem ipsum is
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="bg-gray-300 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Facebook size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Twitter size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Youtube size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              </a>
            </div>
          </div>

          {/* About */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">About</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Find store</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Blogs</a></li>
            </ul>
          </div>

          {/* Partnership */}
          <div className="col-span-1 hidden sm:block lg:block">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Partnership</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Find store</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Blogs</a></li>
            </ul>
          </div>

          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Information</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Money Refund</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Shipping</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Contact us</a></li>
            </ul>
          </div>

          {/* For users */}
          <div className="col-span-1 hidden sm:block lg:block">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">For users</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Login</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Register</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">Settings</a></li>
              <li><a href="#" className="hover:text-blue-500 text-xs sm:text-sm">My Orders</a></li>
            </ul>
          </div>

          {/* Get app */}
          <div className="col-span-1 hidden lg:block">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Get app</h3>
            <div className="space-y-2 sm:space-y-3">
              <a href="#" className="block">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-8 sm:h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 sm:h-10" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-[1180px] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <p className="text-gray-600 text-xs sm:text-sm">© 2023 Ecommerce.</p>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <img src="https://flagcdn.com/w40/us.png" alt="US Flag" className="w-4 h-3 sm:w-5 sm:h-3" />
              <span className="text-xs sm:text-sm">English</span>
              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;