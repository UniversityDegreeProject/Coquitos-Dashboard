
interface SearchPageProps {
  children: React.ReactNode;
}
export const SearchPage = ({ children }: SearchPageProps) => {


  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              {children}
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="cashier">Cajero</option>
            <option value="waiter">Mesero</option>
          </select>
        </div>
      </div>
  )
}
