import { type User } from "../interfaces";
import { UserTable } from "./UserTable";


interface UserGridProps {
  users: User[];
}


export const UserGrid = ({ users }: UserGridProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Lista de Usuarios
        </h2>
      </div>
      <div className="overflow-x-auto">
        <UserTable users={users} />
      </div>
    </div>
  );
};
