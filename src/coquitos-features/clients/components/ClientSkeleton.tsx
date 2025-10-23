import { useTheme } from "@/shared/hooks/useTheme";

export const ClientSkeleton = () => {
  const { isDark, colors } = useTheme();
  return (
    <div className={`${isDark ? 'bg-[#1E293B]' : 'bg-white'} rounded-xl shadow-lg border ${isDark ? 'border-[#334155]' : 'border-gray-100'} overflow-hidden`}>
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className={`mt-4 ${colors.text.muted}`}>Cargando clientes...</p>
    </div>
  </div>
  )
}
