import { useTheme } from "@/shared/hooks/useTheme";
import { GenericGridLoader } from "@/shared/components";

/**
 * Componente de carga para reportes
 */
export const ReportLoader = () => {
  const { isDark } = useTheme();

  return (
    <div className={`space-y-6 ${isDark ? "text-white" : "text-gray-800"}`}>
      <GenericGridLoader title="Cargando reportes..." />
    </div>
  );
};
