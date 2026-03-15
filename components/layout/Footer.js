import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white font-sans text-gray-600 border-t border-gray-200 w-full">
      <div className="max-w-[1180px] mx-auto px-4 py-10">
        <div className="grid grid-cols-7 gap-8">

          {/* Brand and Description — spans 2 of 7 columns */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-400">Brand</span>
            </div>
            <p className="text-gray-500 mb-6 max-w-xs">
              Best information about the company gies here but now lorem ipsum is
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Facebook size={18} fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Twitter size={18} fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Linkedin size={18} fill="currentColor" />
              </a>
              <a href="#" className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-300 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Youtube size={18} fill="currentColor" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Find store</a></li>
              <li><a href="#" className="hover:text-blue-500">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500">Blogs</a></li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Partnership</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500">Find store</a></li>
              <li><a href="#" className="hover:text-blue-500">Categories</a></li>
              <li><a href="#" className="hover:text-blue-500">Blogs</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500">Money Refund</a></li>
              <li><a href="#" className="hover:text-blue-500">Shipping</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact us</a></li>
            </ul>
          </div>

          {/* For users */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For users</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500">Login</a></li>
              <li><a href="#" className="hover:text-blue-500">Register</a></li>
              <li><a href="#" className="hover:text-blue-500">Settings</a></li>
              <li><a href="#" className="hover:text-blue-500">My Orders</a></li>
            </ul>
          </div>

          {/* Get app */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Get app</h3>
            <div className="space-y-3">
              <a href="#" className="block">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
              </a>
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-[1180px] mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">© 2023 Ecommerce.</p>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <img src="https://flagcdn.com/w40/us.png" alt="US Flag" className="w-5 h-3" />
              <span className="text-sm">English</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;