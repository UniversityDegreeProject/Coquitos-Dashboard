type SkeletonColumnType = 'badge' | 'actions' | 'text';

export interface SkeletonColumn {
  width?: string;
  lines?: number;
  avatar?: boolean;
  type?: SkeletonColumnType;
  align?: 'left' | 'right' | 'center';
  count?: number;
}

interface SkeletonLoaderProps {
  rows?: number;
  columns?: SkeletonColumn[];
  showAvatar?: boolean;
  animated?: boolean;
  isDark?: boolean;
}

/**
 * Componente Skeleton reutilizable para tablas
 * @param {Object} props
 * @param {number} props.rows - Número de filas a mostrar (default: 5)
 * @param {SkeletonColumn[]} props.columns - Configuración de columnas
 * @param {boolean} props.showAvatar - Mostrar avatar en la primera columna (default: true)
 * @param {boolean} props.animated - Activar animación de pulso (default: true)
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 5, 
  columns = [],
  showAvatar = true,
  animated = true,
  isDark = false
}) => {
  const defaultColumns: SkeletonColumn[] = [
    { width: 'w-32', lines: 2, avatar: true },
    { width: 'w-40', lines: 1 },
    { width: 'w-24', lines: 1 },
    { width: 'w-16', lines: 1, align: 'right', type: 'actions', count: 1 }
  ];

  const cols = columns.length > 0 ? columns : defaultColumns;

  // Colores para tema light y dark
  const skeletonColors = {
    light: {
      primary: 'from-gray-200 to-gray-300',
      secondary: 'from-gray-200 via-gray-250 to-gray-200',
      avatar: 'from-gray-200 to-gray-300'
    },
    dark: {
      primary: 'from-[#334155] to-[#475569]',
      secondary: 'from-[#334155] via-[#475569] to-[#334155]',
      avatar: 'from-[#334155] to-[#475569]'
    }
  };

  const colors = isDark ? skeletonColors.dark : skeletonColors.light;

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr 
          key={rowIndex} 
          className={`border-b ${isDark ? 'border-[#334155]' : 'border-gray-100'} ${isDark ? 'hover:bg-[#334155]/20' : 'hover:bg-gray-50/50'} transition-colors`}
        >
          {cols.map((col, colIndex) => (
            <td 
              key={colIndex} 
              className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''} ${col.align === 'center' ? 'text-center' : ''}`}
            >
              {/* Columna con avatar */}
              {col.avatar && showAvatar ? (
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors.avatar} ${
                      animated ? 'animate-pulse' : ''
                    }`}
                  />
                  <div className="space-y-1.5 flex-1">
                    {Array.from({ length: col.lines || 1 }).map((_, lineIndex) => (
                      <div 
                        key={lineIndex}
                        className={`h-3 bg-gradient-to-r ${colors.secondary} rounded-md ${
                          lineIndex === 0 ? col.width || 'w-20' : 'w-28'
                        } ${animated ? 'animate-pulse' : ''}`}
                        style={animated ? {
                          animationDelay: `${(rowIndex * 0.1 + colIndex * 0.05)}s`
                        } : {}}
                      />
                    ))}
                  </div>
                </div>
              ) : col.type === 'badge' ? (
                // Badge (Rol, Estado, etc.)
                <div 
                  className={`inline-block h-6 ${col.width || 'w-16'} bg-gradient-to-r ${colors.primary} rounded-full ${
                    animated ? 'animate-pulse' : ''
                  }`}
                  style={animated ? {
                    animationDelay: `${(rowIndex * 0.1 + colIndex * 0.05)}s`
                  } : {}}
                />
              ) : col.type === 'actions' ? (
                // Múltiples botones de acción
                <div className="inline-flex gap-1.5 justify-end">
                  {Array.from({ length: col.count || 3 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-7 h-7 bg-gradient-to-br ${colors.primary} rounded-md ${
                        animated ? 'animate-pulse' : ''
                      }`}
                      style={animated ? {
                        animationDelay: `${(rowIndex * 0.1 + colIndex * 0.05 + i * 0.02)}s`
                      } : {}}
                    />
                  ))}
                </div>
              ) : (
                // Columna simple con líneas de texto
                <div className="space-y-1.5">
                  {Array.from({ length: col.lines || 1 }).map((_, lineIndex) => (
                    <div 
                      key={lineIndex}
                      className={`h-3 bg-gradient-to-r ${colors.secondary} rounded-md ${
                        col.width || 'w-20'
                      } ${lineIndex > 0 ? 'opacity-70' : ''} ${
                        animated ? 'animate-pulse' : ''
                      } ${col.align === 'center' ? 'mx-auto' : ''}`}
                      style={animated ? {
                        animationDelay: `${(rowIndex * 0.1 + colIndex * 0.05)}s`
                      } : {}}
                    />
                  ))}
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};