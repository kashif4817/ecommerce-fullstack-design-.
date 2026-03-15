import { Search, FileText, Send, Shield } from 'lucide-react';

const ExtraServices = () => {
  const services = [
    {
      title: 'Source from\nIndustry Hubs',
      icon: Search,
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop',
    },
    {
      title: 'Customize Your\nProducts',
      icon: FileText,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    },
    {
      title: 'Fast, reliable shipping\nby ocean or air',
      icon: Send,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop',
    },
    {
      title: 'Product monitoring\nand inspection',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
    },
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our extra services</h2>
        <div className="grid grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl overflow-visible shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-gray-100"
            >
              {/* Service Image — NO overflow-hidden */}
              <div className="relative h-[145px] rounded-t-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Icon Badge — OUTSIDE image div, positioned relative to card */}
              <div className="absolute bottom-[58px] right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-sm z-20">
                <service.icon className="w-5 h-5 text-gray-700" />
              </div>

              {/* Service Title */}
              <div className="pt-6 pb-3 px-4">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug whitespace-pre-line">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraServices;