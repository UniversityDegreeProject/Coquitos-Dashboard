import { Edit2, Trash2 } from "lucide-react";

export const UserButtonsActions = () => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex space-x-2">
        <button className="text-blue-600 hover:text-blue-900">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="text-red-600 hover:text-red-900">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  );
};
