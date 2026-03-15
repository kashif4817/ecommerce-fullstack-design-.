const RecommendedItems = () => {
  const products = [
    {
      id: 1,
      name: 'T-shirts with multiple colors, for men',
      price: '$10.30',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Jeans shorts for men blue color',
      price: '$10.30',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Brown winter coat medium size',
      price: '$12.50',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Jeans bag for travel for men',
      price: '$34.00',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Leather wallet',
      price: '$99.00',
      image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=300&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Canon camera black, 100x zoom',
      price: '$9.99',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Headset for gaming with mic',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Smartwatch silver color modern',
      price: '$10.30',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Blue wallet for men leather metarfial',
      price: '$10.30',
      image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=300&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Jeans bag for travel for men',
      price: '$80.95',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
    }
  ];

  return (
    <section className="w-[1180px] h-[696px] mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended items</h2>
      <div className="border border-[#DEE2E7] rounded-xl p-4 h-[636px] overflow-hidden">
        <div className="grid grid-cols-5 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer border border-[#DEE2E7] rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              {/* Image area */}
              <div className="bg-white flex items-center justify-center h-[220px] p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Price + Name */}
              <div className="px-3 pb-3 pt-2 border-t border-[#DEE2E7]">
                <p className="font-bold text-gray-900 text-sm mb-1">{product.price}</p>
                <p className="text-xs text-gray-500 line-clamp-2 leading-snug">{product.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedItems;