const ConsumerElectronicsSection = () => {
  const products = [
    { name: 'Smart watches', price: 'USD 19', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop' },
    { name: 'Cameras', price: 'USD 89', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&h=150&fit=crop' },
    { name: 'Headphones', price: 'USD 10', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop' },
    { name: 'Smart watches', price: 'USD 90', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&h=150&fit=crop' },
    { name: 'Gaming set', price: 'USD 35', image: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=150&h=150&fit=crop' },
    { name: 'Laptops & PC', price: 'USD 340', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop' },
    { name: 'Smartphones', price: 'USD 19', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop' },
    { name: 'Electric kattle', price: 'USD 240', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=150&h=150&fit=crop' },
  ];

  return (
    <section className="w-[1180px] h-[257px] mx-auto border border-gray-200 bg-white flex overflow-hidden">

      {/* Left Banner */}
      <div className="w-[270px] h-full relative bg-[#EEF4F8] shrink-0 flex flex-col justify-between p-5">
        <img
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=280&h=257&fit=crop"
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            Consumer electronics and gadgets
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

export default ConsumerElectronicsSection;