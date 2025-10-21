/**
 * Configuración de compresión de imágenes
 */
const IMAGE_CONFIG = {
  MAX_WIDTH: 800,           // Ancho máximo en píxeles
  MAX_HEIGHT: 800,          // Alto máximo en píxeles
  QUALITY: 0.7,             // Calidad de compresión (0-1)
  MAX_SIZE_KB: 200,         // Tamaño máximo en KB
  OUTPUT_FORMAT: 'image/jpeg' as const, // Formato de salida
};

/**
 * Comprime una imagen a un tamaño y calidad específicos
 * Redimensiona automáticamente si excede las dimensiones máximas
 * 
 * @param file - Archivo de imagen a comprimir
 * @returns Promise con la imagen comprimida en base64
 */
export const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo debe ser una imagen'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Crear canvas para redimensionar y comprimir
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > IMAGE_CONFIG.MAX_WIDTH || height > IMAGE_CONFIG.MAX_HEIGHT) {
          const ratio = Math.min(
            IMAGE_CONFIG.MAX_WIDTH / width,
            IMAGE_CONFIG.MAX_HEIGHT / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Establecer dimensiones del canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a base64 con compresión
        const compressedBase64 = canvas.toDataURL(
          IMAGE_CONFIG.OUTPUT_FORMAT,
          IMAGE_CONFIG.QUALITY
        );

        // Verificar tamaño final
        const sizeInKB = Math.round((compressedBase64.length * 3) / 4 / 1024);
        
        console.log(`[ImageCompression] 📦 Imagen comprimida:
          📏 Dimensiones originales: ${img.width}x${img.height}
          📐 Dimensiones finales: ${width}x${height}
          💾 Tamaño original: ~${Math.round(file.size / 1024)} KB
          ✨ Tamaño comprimido: ~${sizeInKB} KB
          🎯 Reducción: ${Math.round((1 - sizeInKB / (file.size / 1024)) * 100)}%`
        );

        if (sizeInKB > IMAGE_CONFIG.MAX_SIZE_KB) {
          console.warn(`[ImageCompression] ⚠️ La imagen comprimida (${sizeInKB} KB) excede el límite recomendado (${IMAGE_CONFIG.MAX_SIZE_KB} KB)`);
        }

        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Valida el tamaño del archivo antes de procesarlo
 * 
 * @param file - Archivo a validar
 * @param maxSizeMB - Tamaño máximo en MB (por defecto 5 MB)
 * @returns true si es válido, false si excede el límite
 */
export const validateImageSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Obtiene información sobre un archivo de imagen
 * 
 * @param file - Archivo de imagen
 * @returns Información del archivo
 */
export const getImageInfo = (file: File) => {
  const sizeInKB = Math.round(file.size / 1024);
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    sizeInKB,
    sizeInMB,
    isValid: validateImageSize(file),
  };
};

