import React from 'react';

const InquirySection = () => {
  return (
    <section className="w-[1180px] h-[420px] mx-auto border border-[#E0E0E0] rounded-xl overflow-hidden">
      <div className="relative w-full h-full flex items-center">

        {/* Full Blue Background with image overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=420&fit=crop"
            alt="Background"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        </div>

        {/* Left text content */}
        <div className="relative z-10 flex-1 pl-10 pr-6">
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            An easy way to send <br /> requests to all suppliers
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-[320px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        {/* Right floating white card */}
        <div className="relative z-10 w-[460px] shrink-0 bg-white rounded-xl p-6 mr-8 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Send quote to suppliers
          </h3>

          <div className="space-y-3">
            {/* Item input */}
            <input
              type="text"
              placeholder="What item you need?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
            />

            {/* Details textarea */}
            <textarea
              placeholder="Type more details"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-500"
            />

            {/* Quantity row */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Quantity"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
              />
              <select className="w-[130px] px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700">
                <option>Pcs</option>
                <option>Set</option>
                <option>Box</option>
                <option>Dozen</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Send inquiry
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InquirySection;