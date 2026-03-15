'use client'
import { useState, useEffect } from 'react';

const DealSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const products = [
    { name: 'Smart watches', discount: '-25%', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
    { name: 'Laptops', discount: '-15%', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { name: 'GoPro cameras', discount: '-40%', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&h=200&fit=crop' },
    { name: 'Headphones', discount: '-25%', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { name: 'Canon camreras', discount: '-25%', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop' },
  ];

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="w-[1180px] h-[240px] mx-auto border border-[#DEE2E7] bg-white flex overflow-hidden">

      {/* Left — Timer */}
      <div className="w-[220px] shrink-0 border-r border-[#DEE2E7] flex flex-col justify-center px-5 py-4">
        <h3 className="text-base font-bold text-gray-900">Deals and offers</h3>
        <p className="text-xs text-gray-400 mb-4">Hygiene equipments</p>
        <div className="flex gap-2">
          {[
            { value: pad(timeLeft.days), label: 'Days' },
            { value: pad(timeLeft.hours), label: 'Hour' },
            { value: pad(timeLeft.minutes), label: 'Min' },
            { value: pad(timeLeft.seconds), label: 'Sec' },
          ].map((item) => (
            <div key={item.label} className="bg-[#333] text-white rounded px-2.5 py-1.5 flex flex-col items-center min-w-[44px]">
              <span className="text-base font-bold leading-tight">{item.value}</span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Products */}
      <div className="flex-1 grid grid-cols-5 divide-x divide-[#DEE2E7]">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 py-4 px-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Large image */}
            <div className="w-[120px] h-[120px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Name */}
            <p className="text-sm text-gray-700 text-center leading-tight">{product.name}</p>

            {/* Discount badge */}
            <span className="bg-[#FFE3E3] text-red-500 text-xs font-medium px-3 py-0.5 rounded-full">
              {product.discount}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default DealSection;