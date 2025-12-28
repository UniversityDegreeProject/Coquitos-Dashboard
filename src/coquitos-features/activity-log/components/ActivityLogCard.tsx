import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  User,
  Package,
  ShoppingCart,
  Wallet,
  Tag,
  Users,
  Database,
  Settings,
  Eye,
} from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ActivityLog } from "../interfaces/activity-log";

interface ActivityLogCardProps {
  log: ActivityLog;
  onViewDetails: (log: ActivityLog) => void;
}

const getEntityIcon = (entity: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    User: <User className="w-5 h-5" />,
    Product: <Package className="w-5 h-5" />,
    Sale: <ShoppingCart className="w-5 h-5" />,
    CashRegister: <Wallet className="w-5 h-5" />,
    Category: <Tag className="w-5 h-5" />,
    Customer: <Users className="w-5 h-5" />,
    ProductBatch: <Database className="w-5 h-5" />,
    System: <Settings className="w-5 h-5" />,
  };
  return iconMap[entity] || <Database className="w-5 h-5" />;
};

const getActionColor = (action: string): string => {
  if (action.includes("CREATE")) return "green";
  if (action.includes("UPDATE")) return "blue";
  if (action.includes("DELETE")) return "red";
  if (action.includes("LOGIN") || action.includes("LOGOUT")) return "purple";
  return "yellow";
};

const getActionBadge = (action: string, isDark: boolean) => {
  const color = getActionColor(action);
  const colorClasses = {
    green: isDark
      ? "bg-green-900/30 text-green-400"
      : "bg-green-100 text-green-700",
    blue: isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700",
    red: isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700",
    yellow: isDark
      ? "bg-yellow-900/30 text-yellow-400"
      : "bg-yellow-100 text-yellow-700",
    purple: isDark
      ? "bg-purple-900/30 text-purple-400"
      : "bg-purple-100 text-purple-700",
  };

  return colorClasses[color as keyof typeof colorClasses];
};

export const ActivityLogCard = ({
  log,
  onViewDetails,
}: ActivityLogCardProps) => {
  const { isDark, colors } = useTheme();

  const timeAgo = formatDistanceToNow(new Date(log.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const actionBadgeClass = getActionBadge(log.action, isDark);

  return (
    <div
      className={`${
        isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-200"
      } rounded-xl p-5 border-2 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* User Avatar */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              isDark
                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                : "bg-gradient-to-br from-[#275081] to-[#F59E0B]"
            }`}
          >
            {log.user.name.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* User name and time */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className={`font-bold text-lg ${colors.text.primary}`}>
                {log.user.name}
              </h3>
              <span className={`text-sm ${colors.text.muted}`}>{timeAgo}</span>
            </div>

            {/* Description */}
            <p className={`${colors.text.primary} mb-3`}>{log.description}</p>

            {/* Entity and Action badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                  isDark
                    ? "bg-[#0F172A] text-blue-400"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {getEntityIcon(log.entity)}
                {log.entity}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${actionBadgeClass}`}
              >
                {log.action}
              </span>
              {log.entityId && (
                <span className={`text-xs ${colors.text.muted}`}>
                  ID: {log.entityId.substring(0, 8)}...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(log)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isDark
              ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          Ver Detalles
        </button>
      </div>
    </div>
  );
};
