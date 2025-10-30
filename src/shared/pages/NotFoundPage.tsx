
import { useNavigate } from "react-router";


export const NotFoundPage = () => {
  const navigate = useNavigate();


  // Manejador para volver atrás en el historial
  const handleGoBack = () => {
    navigate(-1);
  };

  // Manejador para ir al dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard/home');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F7E7 0%, #E8EBD8 50%, #F5F7E7 100%)' }}>
      {/* Grid de fondo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(153, 174, 191, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(153, 174, 191, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Contenedor principal */}
      <div className="text-center space-y-6" style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="text-4xl font-bold text-[#4682B4] mb-4">404</h1>
        <p className="text-xl text-[#2F4F4F] mb-6">La página que buscas no existe</p>
        
        {/* Contenedor de botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4682B4] text-white rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer relative z-10"
            style={{ pointerEvents: 'auto' }}
            type="button"
          >
            Volver atrás
          </button>
          <button
            onClick={handleGoToDashboard}
            className="px-6 py-3 bg-gradient-to-r from-[#4682B4] to-[#2F4F4F] text-white rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer relative z-10"
            style={{ pointerEvents: 'auto' }}
            type="button"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
      
    </div>
  )
}
