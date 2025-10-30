import { ArrowLeft, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from "@/shared/hooks/useTheme";
import { paths } from "@/router/paths";

/**
 * Header de la página de movimientos de stock
 */
export const StockMovementsHeader = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();

  const handleGoBack = () => {
    navigate(paths.dashboard.products);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={handleGoBack}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-250 transition-colors cursor-pointer`}
        >
          <ArrowLeft className={`w-5 h-5 ${colors.text.primary} `} />
        </button>
        <div className={`p-2 rounded-lg ${isDark ? 'bg-gradient-to-r from-[#1E3A8A]/20 to-[#F59E0B]/20' : 'bg-gradient-to-r from-[#275081]/10 to-[#F9E44E]/20'}`}>
          <ClipboardList className={`w-6 h-6 ${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'}`} />
        </div>
        <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
          Historial de Movimientos de Stock
        </h3>
      </div>
    </div>
  );
};
