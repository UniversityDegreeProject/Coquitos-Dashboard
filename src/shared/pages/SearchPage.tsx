
import { useTheme } from '@/shared/hooks/useTheme';

interface SearchPageProps {
  children: React.ReactNode;
  roleFilter?: React.ReactNode;
  statusFilter?: React.ReactNode;
}

export const SearchPage = ({ children, roleFilter, statusFilter }: SearchPageProps) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} rounded-xl p-6 shadow-lg border backdrop-blur-sm`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            {children}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          {roleFilter && (
            <div className="min-w-[180px]">
              {roleFilter}
            </div>
          )}
          {statusFilter && (
            <div className="min-w-[180px]">
              {statusFilter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
