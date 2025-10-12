import { Beef, Package, TrendingUp, ShoppingCart } from 'lucide-react';

export default function AnimatedWelcome() {
  return (
    <div className="relative w-full max-w-xs xl:max-w-sm 2xl:max-w-md">
      <div className="relative aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F9E44E]/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="relative flex items-center justify-center h-full animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F9E44E] rounded-full blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative bg-white rounded-full p-10 xl:p-12 2xl:p-16 shadow-2xl">
              <Beef className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-32 2xl:h-32 text-[#275081]" strokeWidth={1.5} />
            </div>

            <div className="absolute -top-3 -right-3 xl:-top-4 xl:-right-4 bg-white rounded-xl xl:rounded-2xl p-2.5 xl:p-3 2xl:p-4 shadow-xl animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
              <Package className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-[#F9E44E]" />
            </div>

            <div className="absolute -bottom-3 -left-3 xl:-bottom-4 xl:-left-4 bg-white rounded-xl xl:rounded-2xl p-2.5 xl:p-3 2xl:p-4 shadow-xl animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}>
              <TrendingUp className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-[#275081]" />
            </div>

            <div className="absolute top-1/2 -right-6 xl:-right-8 bg-white rounded-xl xl:rounded-2xl p-2.5 xl:p-3 2xl:p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s', animationDuration: '6s' }}>
              <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-[#275081]" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border-4 border-[#F9E44E]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-5/6 h-5/6 border-4 border-white/10 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
