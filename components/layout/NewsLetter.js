import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="bg-gray-100 w-full py-6 sm:py-8">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center px-3 sm:px-4">
        <div className="text-center w-full">
          <h2 className="text-gray-900 font-semibold text-base sm:text-[17px] mb-1 sm:mb-1.5">
            Subscribe on our newsletter
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-5">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>

          {/* Input + Button wrapped in a single bordered container */}
          <div className="flex flex-col sm:flex-row items-center max-w-[380px] mx-auto border border-gray-300 rounded-md overflow-hidden bg-white gap-0">
            <div className="flex items-center flex-1 px-3 py-2 sm:py-0">
              <Mail size={16} className="text-gray-400 shrink-0 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="w-full py-1.5 sm:py-2.5 text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-auto">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;