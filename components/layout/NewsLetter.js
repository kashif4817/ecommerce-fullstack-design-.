import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="bg-gray-100 w-full py-0" style={{ height: '190px' }}>
      <div className="max-w-[1440px] h-full mx-auto flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-gray-900 font-semibold text-[17px] mb-1.5">
            Subscribe on our newsletter
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>

          {/* Input + Button wrapped in a single bordered container */}
          <div className="flex items-center max-w-[380px] mx-auto border border-gray-300 rounded-md overflow-hidden bg-white">
            <div className="flex items-center flex-1 px-3">
              <Mail size={16} className="text-gray-400 shrink-0 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="w-full py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;