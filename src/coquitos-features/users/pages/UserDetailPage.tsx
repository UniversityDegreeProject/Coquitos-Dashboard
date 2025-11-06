//* Librerias
import { useNavigate } from "react-router";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Clock,
  CheckCircle2,
  XCircle,
  LogIn,
} from "lucide-react";

//* Others
import { useTheme } from "@/shared/hooks/useTheme";
import { formateDatetime, getRoleColor, getStatusColor } from "../helpers";
import { paths } from "@/router/paths";
import { useGetUserById } from "../hooks/useGetUserById";

export const UserDetailPage = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();

  // Obtener todos los usuarios y filtrar por ID
  const { user, isLoading } = useGetUserById();

  console.log(user);

  // Manejador para volver
  const handleGoBack = () => {
    navigate(paths.dashboard.users);
  };




  // Formatear fecha
  const formatDate = (date : Date | string ) => {
    if (!date) return 'N/A';
    
    return formateDatetime(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Si no se encuentra el usuario, redirigir a la página 404
    navigate('/dashboard/404', { replace: true });
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleGoBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDark ? 'bg-[#1E293B] hover:bg-[#334155]' : 'bg-white hover:bg-gray-50'} transition-all duration-200 shadow-sm`}
        >
          <ArrowLeft className={`w-5 h-5 ${colors.text.primary}`} />
          <span className={`font-medium ${colors.text.primary}`}>Volver</span>
        </button>
        
       
      </div>

      {/* Card principal con información del usuario */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
        {/* Banner superior con gradiente */}
        <div className={`h-32 bg-gradient-to-r ${colors.gradient.accent} relative`}>
          <div className="absolute -bottom-16 left-8">
            <div className={`w-32 h-32 rounded-full ${isDark ? 'bg-[#1E293B]' : 'bg-white'} p-2 shadow-xl`}>
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors.gradient.accent} flex items-center justify-center`}>
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${colors.text.primary}`}>
                {user.firstName} {user.lastName}
              </h1>
              <p className={`text-lg ${colors.text.secondary}`}>@{user.username}</p>
            </div>
            <div className="flex gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleColor(user.role)} shadow-md`}>
                {user.role}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(user.status)} shadow-md`}>
                {user.status}
              </span>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Mail className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Email</span>
              </div>
              <p className={`text-lg font-medium ${colors.text.primary}`}>{user.email}</p>
              <div className="flex items-center mt-2">
                {user.emailVerified ? (
                  <span className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verificado
                  </span>
                ) : (
                  <span className="flex items-center text-sm text-yellow-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    No verificado
                  </span>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Phone className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Teléfono</span>
              </div>
              <p className={`text-lg font-medium ${colors.text.primary}`}>{user.phone || 'No especificado'}</p>
            </div>

            {/* Rol */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Rol del Sistema</span>
              </div>
              <p className={`text-lg font-medium ${colors.text.primary}`}>{user.role}</p>
              <p className={`text-sm mt-1 ${colors.text.secondary}`}>
                {user.role === 'Administrador' 
                  ? 'Acceso completo al sistema' 
                  : 'Acceso limitado a operaciones de caja'}
              </p>
            </div>

            {/* Fecha de creación */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Fecha de Registro</span>
              </div>
              <p className={`text-lg font-medium ${colors.text.primary}`}>
                {formatDate(user.createdAt || new Date())}
              </p>
            </div>

            {/* Última actualización */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <Clock className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Última Actualización</span>
              </div>
              <p className={`text-lg font-medium ${colors.text.primary}`}>
                  {formatDate(user.updatedAt || new Date())}
              </p>
            </div>

            {/* Última conexión */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-[#0F172A]' : 'bg-gray-50'} border ${isDark ? 'border-[#334155]' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <LogIn className={`w-5 h-5 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
                <span className={`text-sm font-semibold ${colors.text.secondary}`}>Última Conexión</span>
              </div>
              <p className={`text-sm font-mono ${colors.text.primary} break-all`}>
                {formatDate(user.lastConnection || new Date())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card de actividad reciente (puedes expandir esto más adelante) */}
      <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} p-6`}>
        <h2 className={`text-xl font-bold mb-4 ${colors.text.primary}`}>
          Actividad Reciente
        </h2>
        <div className={`text-center py-8 ${colors.text.secondary}`}>
          <p>Futuros cambios</p>
        </div>
      </div>
    </div>
  );
};

