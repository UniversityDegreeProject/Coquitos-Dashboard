import {
  X,
  Copy,
  User,
  Calendar,
  Globe,
  Monitor,
  Database,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ActivityLog, ParsedMetadata } from "../interfaces/activity-log";

interface ActivityLogDetailModalProps {
  log: ActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityLogDetailModal = ({
  log,
  isOpen,
  onClose,
}: ActivityLogDetailModalProps) => {
  const { isDark, colors } = useTheme();

  if (!isOpen || !log) return null;

  const parsedMetadata: ParsedMetadata | null = log.metadata
    ? JSON.parse(log.metadata)
    : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  const formattedDate = format(
    new Date(log.createdAt),
    "dd 'de' MMMM 'de' yyyy - HH:mm:ss",
    {
      locale: es,
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-200"
        } rounded-2xl border max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-[#334155]" : "border-gray-200"
          }`}
        >
          <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
            Detalles de la Actividad
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-[#334155]" : "hover:bg-gray-100"
            }`}
          >
            <X className={`w-6 h-6 ${colors.text.primary}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className={`w-5 h-5 ${colors.text.muted}`} />
              <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                Usuario
              </h3>
            </div>
            <div className={`pl-7 space-y-1 ${colors.text.primary}`}>
              <p className="font-medium">{log.user.name}</p>
              <p className={`text-sm ${colors.text.muted}`}>{log.user.email}</p>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mt-2 ${
                  isDark
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {log.user.role}
              </span>
            </div>
          </div>

          {/* Activity Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className={`w-5 h-5 ${colors.text.muted}`} />
              <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                Actividad
              </h3>
            </div>
            <div className={`pl-7 space-y-2 ${colors.text.primary}`}>
              <div>
                <span className={`text-sm ${colors.text.muted}`}>Acción:</span>
                <span className="ml-2 font-medium">{log.action}</span>
              </div>
              <div>
                <span className={`text-sm ${colors.text.muted}`}>Entidad:</span>
                <span className="ml-2 font-medium">{log.entity}</span>
              </div>
              {log.entityId && (
                <div>
                  <span className={`text-sm ${colors.text.muted}`}>
                    ID de Entidad:
                  </span>
                  <span className="ml-2 font-mono text-sm">{log.entityId}</span>
                  <button
                    onClick={() => copyToClipboard(log.entityId || "")}
                    className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-[#334155] rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className={`w-5 h-5 ${colors.text.muted}`} />
              <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                Fecha y Hora
              </h3>
            </div>
            <p className={`pl-7 ${colors.text.primary}`}>{formattedDate}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className={`font-semibold text-lg ${colors.text.primary} mb-3`}>
              Descripción
            </h3>
            <p
              className={`${colors.text.primary} ${
                isDark ? "bg-[#0F172A]" : "bg-gray-50"
              } p-4 rounded-lg`}
            >
              {log.description}
            </p>
          </div>

          {/* System Info */}
          {(log.ipAddress || log.userAgent) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className={`w-5 h-5 ${colors.text.muted}`} />
                <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                  Información del Sistema
                </h3>
              </div>
              <div className={`pl-7 space-y-2 ${colors.text.primary}`}>
                {log.ipAddress && (
                  <div>
                    <span className={`text-sm ${colors.text.muted}`}>
                      Dirección IP:
                    </span>
                    <span className="ml-2 font-mono text-sm">
                      {log.ipAddress}
                    </span>
                  </div>
                )}
                {log.userAgent && (
                  <div>
                    <span className={`text-sm ${colors.text.muted}`}>
                      Navegador:
                    </span>
                    <span className="ml-2 text-sm">{log.userAgent}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata JSON */}
          {parsedMetadata && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Monitor className={`w-5 h-5 ${colors.text.muted}`} />
                  <h3
                    className={`font-semibold text-lg ${colors.text.primary}`}
                  >
                    Datos Adicionales
                  </h3>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(parsedMetadata, null, 2))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    isDark
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  Copiar JSON
                </button>
              </div>
              <pre
                className={`${
                  isDark ? "bg-[#0F172A]" : "bg-gray-50"
                } p-4 rounded-lg overflow-x-auto text-sm ${
                  colors.text.primary
                }`}
              >
                {JSON.stringify(parsedMetadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t ${
            isDark ? "border-[#334155]" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              isDark
                ? "bg-[#334155] text-white hover:bg-[#475569]"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
