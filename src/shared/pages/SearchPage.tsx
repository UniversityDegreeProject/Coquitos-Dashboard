
interface SearchPageProps {
  children: React.ReactNode;
  roleFilter?: React.ReactNode;
  statusFilter?: React.ReactNode;
}

export const SearchPage = ({ children, roleFilter, statusFilter }: SearchPageProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 backdrop-blur-sm">
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
