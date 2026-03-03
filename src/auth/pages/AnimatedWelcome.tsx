import { Package, TrendingUp, ShoppingCart, Heart } from 'lucide-react';

export default function AnimatedWelcome() {
  return (
    <div className="relative w-full max-w-xs xl:max-w-sm 2xl:max-w-md">
      <div className="relative aspect-square">
        {/* Círculos de energía azul suaves */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#87CEEB]/25 to-[#4682B4]/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-4 bg-gradient-to-br from-[#B0E0E6]/20 to-[#87CEEB]/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="relative flex items-center justify-center h-full animate-float">
          <div className="relative group">
            {/* Círculos concéntricos de energía */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#87CEEB]/30 to-[#4682B4]/20 rounded-full blur-2xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity duration-500"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-[#B0E0E6]/25 to-[#87CEEB]/15 rounded-full blur-xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity duration-500" style={{ animationDelay: '1s' }}></div>

            {/* Icono principal con diseño corporativo elegante */}
            <div className="relative bg-gradient-to-br from-white via-[#F0F8FF] to-[#E6F3FF] rounded-full p-4 xl:p-6 2xl:p-8 shadow-2xl border border-[#87CEEB]/20 group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 flex items-center justify-center">
                <img 
                  src="/imagen-corporativa.svg" 
                  alt="Embutidos Coquito" 
                  className="w-32 h-32 xl:w-40 xl:h-40 2xl:w-48 2xl:h-48 drop-shadow-sm object-contain filter brightness-110 contrast-110"
                />
            </div>

            {/* Partículas flotantes alrededor del icono principal - colores más oscuros */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#2F4F4F]/70 rounded-full animate-float-particle"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#4682B4]/80 rounded-full animate-float-particle" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 -left-6 w-2.5 h-2.5 bg-[#708090]/90 rounded-full animate-float-particle" style={{ animationDelay: '3s' }}></div>

            {/* Iconos flotantes con animaciones de rotación alrededor del icono central */}
            <div className="absolute -top-4 -right-4 xl:-top-6 xl:-right-6 bg-gradient-to-br from-[#87CEEB] to-[#4682B4] rounded-2xl xl:rounded-3xl p-3 xl:p-4 2xl:p-5 shadow-md animate-rotate-around group-hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '1s', animationDuration: '8s' }}>
              <Package className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 text-[#F0F8FF] drop-shadow-sm" />
            </div>

            <div className="absolute -bottom-4 -left-4 xl:-bottom-6 xl:-left-6 bg-gradient-to-br from-[#4682B4] to-[#2F4F4F] rounded-2xl xl:rounded-3xl p-3 xl:p-4 2xl:p-5 shadow-md animate-rotate-around group-hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '2.5s', animationDuration: '10s' }}>
              <TrendingUp className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 text-[#F0F8FF] drop-shadow-sm" />
            </div>

            <div className="absolute top-1/2 -right-8 xl:-right-10 bg-gradient-to-br from-[#5F9EA0] to-[#708090] rounded-2xl xl:rounded-3xl p-3 xl:p-4 2xl:p-5 shadow-md animate-rotate-around group-hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.5s', animationDuration: '9s' }}>
              <ShoppingCart className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 text-[#F0F8FF] drop-shadow-sm" />
            </div>

            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-2xl xl:rounded-3xl p-2.5 xl:p-3 2xl:p-4 shadow-md animate-rotate-around group-hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '3.5s', animationDuration: '11s' }}>
              <Heart className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-white drop-shadow-sm" />
            </div>
          </div>
        </div>

        {/* Ondas de energía concéntricas - comienzan fuera de la esfera */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#87CEEB]/25 rounded-full animate-pulse-wave" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#4682B4]/20 rounded-full animate-pulse-wave" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#5F9EA0]/18 rounded-full animate-pulse-wave" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
}
