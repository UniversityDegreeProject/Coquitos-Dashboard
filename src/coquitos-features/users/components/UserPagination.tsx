import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

interface UserPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFetching: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onChangeLimit: (limit: number) => void;
}

export const UserPagination = ({
  page,
  totalPages,
  total,
  limit,
  hasNextPage,
  hasPreviousPage,
  isFetching,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onChangeLimit,
}: UserPaginationProps) => {
  
  const { colors, isDark } = useTheme();

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? 'border-[#334155] bg-[#0F172A]' : 'border-gray-200 bg-white'} rounded-b-xl`}>
      
      {/* Información de resultados */}
      <div className="flex items-center space-x-4">
        <p className={`text-sm ${colors.text.secondary}`}>
          Mostrando <span className="font-semibold">{startIndex}</span> a <span className="font-semibold">{endIndex}</span> de <span className="font-semibold">{total}</span> usuarios
        </p>
        
        {/* Selector de límite */}
        <select
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          disabled={isFetching}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            isDark 
              ? 'bg-[#1E293B] border-[#334155] text-[#F8FAFC]' 
              : 'bg-white border-gray-300 text-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-[#F59E0B] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer`}
        >
          <option value={5}>5 por página</option>
          <option value={7}>7 por página</option>
        </select>
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center space-x-2">
        
        {/* Botón Primera Página */}
        <button
          onClick={onFirstPage}
          disabled={!hasPreviousPage || isFetching}
          className={`p-2 rounded-lg transition-all duration-200 ${
            !hasPreviousPage || isFetching
              ? 'opacity-50 cursor-not-allowed'
              : `${isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} cursor-pointer`
          }`}
          title="Primera página"
        >
          <ChevronsLeft className={`w-5 h-5 ${colors.text.secondary}`} />
        </button>

        {/* Botón Anterior */}
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || isFetching}
          className={`p-2 rounded-lg transition-all duration-200 ${
            !hasPreviousPage || isFetching
              ? 'opacity-50 cursor-not-allowed'
              : `${isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} cursor-pointer`
          }`}
          title="Página anterior"
        >
          <ChevronLeft className={`w-5 h-5 ${colors.text.secondary}`} />
        </button>

        {/* Indicador de página */}
        <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-[#1E293B]' : 'bg-gray-100'}`}>
          <span className={`text-sm font-medium ${colors.text.primary}`}>
            Página {page} de {totalPages}
          </span>
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage || isFetching}
          className={`p-2 rounded-lg transition-all duration-200 ${
            !hasNextPage || isFetching
              ? 'opacity-50 cursor-not-allowed'
              : `${isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} cursor-pointer`
          }`}
          title="Página siguiente"
        >
          <ChevronRight className={`w-5 h-5 ${colors.text.secondary}`} />
        </button>

        {/* Botón Última Página */}
        <button
          onClick={onLastPage}
          disabled={!hasNextPage || isFetching}
          className={`p-2 rounded-lg transition-all duration-200 ${
            !hasNextPage || isFetching
              ? 'opacity-50 cursor-not-allowed'
              : `${isDark ? 'hover:bg-[#1E293B]' : 'hover:bg-gray-100'} cursor-pointer`
          }`}
          title="Última página"
        >
          <ChevronsRight className={`w-5 h-5 ${colors.text.secondary}`} />
        </button>
      </div>

      {/* Indicador de carga */}
      {isFetching && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#275081] animate-pulse" />
      )}
    </div>
  );
};

