const HomeOutdoorSection = () => {
  const products = [
    { name: 'Soft chairs', price: 'USD 19', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=150&h=150&fit=crop' },
    { name: 'Sofa & chair', price: 'USD 19', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop' },
    { name: 'Kitchen dishes', price: 'USD 19', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&h=150&fit=crop' },
    { name: 'Smart watches', price: 'USD 19', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop' },
    { name: 'Kitchen mixer', price: 'USD 100', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=150&h=150&fit=crop' },
    { name: 'Blenders', price: 'USD 39', image: 'https://images.unsplash.com/photo-1570222094114-28a9d88a27e6?w=150&h=150&fit=crop' },
    { name: 'Home appliance', price: 'USD 19', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150&h=150&fit=crop' },
    { name: 'Coffee maker', price: 'USD 10', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=150&h=150&fit=crop' },
  ];

  return (
    <section className="w-[1180px] h-[257px] mx-auto border border-gray-200 bg-white flex overflow-hidden">

      {/* Left Banner */}
      <div className="w-[270px] h-full relative bg-[#F5F0E8] shrink-0 flex flex-col justify-between p-5">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=280&h=257&fit=crop"
          alt="Home and outdoor"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Home and outdoor
          </h3>
        </div>
        <div className="relative z-10">
          <button className="bg-white px-4 py-1.5 text-sm font-medium rounded hover:bg-gray-100 transition-colors border border-gray-200">
            Source now
          </button>
        </div>
      </div>

      {/* Right Products Grid — 4 cols × 2 rows */}
      <div className="flex-1 grid grid-cols-4 grid-rows-2 border-l border-gray-200">
        {products.map((product, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors
              ${index % 4 !== 3 ? 'border-r border-gray-200' : ''}
              ${index < 4 ? 'border-b border-gray-200' : ''}
            `}
          >
            {/* Left: name + price */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-800">{product.name}</span>
              <span className="text-xs text-gray-400">From</span>
              <span className="text-xs text-gray-400">{product.price}</span>
            </div>

            {/* Right: image */}
            <div className="w-[70px] h-[70px] shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default HomeOutdoorSection;