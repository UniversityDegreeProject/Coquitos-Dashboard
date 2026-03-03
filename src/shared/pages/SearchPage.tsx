import { Shield, Users } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { roleOptions } from "@/coquitos-features/users/const/role-options";
import { statusOptions } from "@/coquitos-features/users/const/status-options";
import type { Role, Status } from "@/coquitos-features/users/interfaces";

interface SearchPageProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  roleFilter: Role | "";
  onRoleChange: (value: Role | "") => void;
  statusFilter: Status | "";
  onStatusChange: (value: Status | "") => void;
}

export const SearchPage = ({
  searchValue,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
}: SearchPageProps) => {
  const { isDark } = useTheme();

  

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-[#E5E7EB]"
      } rounded-xl p-6 shadow-sm border backdrop-blur-sm`}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1">
          <div className="space-y-2">
            <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
              Buscar usuarios...
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar usuarios..."
              className={`w-full pl-4 pr-4 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} placeholder:${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="min-w-[180px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Filtrar por Rol
              </label>
              <div className="relative group">
                <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={roleFilter}
                  onChange={(e) => onRoleChange(e.target.value as Role | "")}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
                >
                  <option value="">Todos los roles</option>
                  {roleOptions.map((option) => {
                    if(option.value === "") {
                      return null;
                    }
                    return (
                      <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="min-w-[180px]">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'}`}>
                Filtrar por Estado
              </label>
              <div className="relative group">
                <Users className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'} group-focus-within:${isDark ? 'text-[#F59E0B]' : 'text-[#275081]'} transition-colors duration-200 z-10`} />
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value as Status | "")}
                  className={`w-full pl-12 pr-10 py-3.5 rounded-xl border ${isDark ? 'bg-[#1E293B] border-[#334155]' : 'bg-white border-[#E5E7EB]'} backdrop-blur-sm shadow-sm ${isDark ? 'border-[#334155] focus:border-[#F59E0B] focus:ring-[#F59E0B]/20' : 'border-[#E5E7EB] focus:border-[#275081] focus:ring-[#275081]/20'} focus:ring-2 ring-offset-1 outline-none transition-all duration-200 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1F2937]'} appearance-none cursor-pointer hover:${isDark ? 'border-[#475569]' : 'border-[#D1D5DB]'}`}
                >
                  <option value="">Todos los estados</option>
                  {statusOptions.map((option) => {
                    if(option.value === "") {
                      return null;
                    }
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className={`w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
