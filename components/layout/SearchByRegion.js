const SearchByRegion = () => {
  const regions = [
    { name: 'Arabic Emirates', flag: 'ae', url: 'shopname.ae' },
    { name: 'Australia', flag: 'au', url: 'shopname.ae' },
    { name: 'United States', flag: 'us', url: 'shopname.ae' },
    { name: 'Russia', flag: 'ru', url: 'shopname.ru' },
    { name: 'Italy', flag: 'it', url: 'shopname.it' },
    { name: 'Denmark', flag: 'dk', url: 'denmark.com.dk' },
    { name: 'France', flag: 'fr', url: 'shopname.com.fr' },
    { name: 'Arabic Emirates', flag: 'ae', url: 'shopname.ae' },
    { name: 'China', flag: 'cn', url: 'shopname.ae' },
    { name: 'Great Britain', flag: 'gb', url: 'shopname.co.uk' },
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1177px] mx-auto px-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Suppliers by region</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {regions.map((region, index) => (
            <a 
              key={index} 
              href="#" 
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <img
                src={`https://flagcdn.com/w40/${region.flag}.png`}
                alt={`${region.name} flag`}
                className="w-6 h-4 object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{region.name}</p>
                <p className="text-xs text-gray-500">{region.url}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchByRegion;
