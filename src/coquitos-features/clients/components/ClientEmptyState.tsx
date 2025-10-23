import { Users } from "lucide-react"
import { useTheme } from "@/shared/hooks/useTheme";

export const ClientEmptyState = () => {
  const { isDark, colors } = useTheme();
  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
    <div className="p-12 text-center">
      <Users className={`w-16 h-16 mx-auto ${colors.text.muted} opacity-50`} />
      <p className={`mt-4 text-lg ${colors.text.primary}`}>No hay clientes para mostrar</p>
      <p className={`mt-2 ${colors.text.muted}`}>
        Comienza agregando tu primer cliente
      </p>
    </div>
  </div>
  )
}
