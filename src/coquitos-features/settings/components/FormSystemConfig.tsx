import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Store, Save, Database, Upload, X } from "lucide-react";
import { useSystemConfig } from "../hooks/useSystemConfig";
import { useTheme } from "@/shared/hooks/useTheme";
import type { SystemConfigItem } from "../interfaces/system-config";

type ConfigFormData = {
  restaurantName: string;
  address: string;
  phone: string;
  nit: string;
  timezone: string;
  currency: string;
  dateFormat: string;
};

export const FormSystemConfig = () => {
  const { configs, isLoading, updateConfig, isUpdating } = useSystemConfig();
  const { isDark, colors } = useTheme();
  const [imagePreview, setImagePreview] = useState<string>("");

  const { register, handleSubmit, setValue } = useForm<ConfigFormData>();

  // Populate form when data is loaded
  useEffect(() => {
    if (configs.length > 0) {
      const getValue = (key: string) =>
        configs.find((c) => c.key === key)?.value || "";

      setValue("restaurantName", getValue("RESTAURANT_NAME"));
      setValue("address", getValue("RESTAURANT_ADDRESS"));
      setValue("phone", getValue("RESTAURANT_PHONE"));
      setValue("nit", getValue("RESTAURANT_NIT"));
      setValue("timezone", getValue("SYSTEM_TIMEZONE") || "America/La_Paz");
      setValue("currency", getValue("SYSTEM_CURRENCY") || "BOB");
      setValue("dateFormat", getValue("SYSTEM_DATE_FORMAT") || "DD/MM/YYYY");

      const logo = getValue("RESTAURANT_LOGO");
      if (logo) setImagePreview(logo);
    }
  }, [configs, setValue]);

  const onSubmit = (data: ConfigFormData) => {
    const changes: SystemConfigItem[] = [
      { key: "RESTAURANT_NAME", value: data.restaurantName },
      { key: "RESTAURANT_ADDRESS", value: data.address },
      { key: "RESTAURANT_PHONE", value: data.phone },
      { key: "RESTAURANT_NIT", value: data.nit },
      { key: "SYSTEM_TIMEZONE", value: data.timezone },
      { key: "SYSTEM_CURRENCY", value: data.currency },
      { key: "SYSTEM_DATE_FORMAT", value: data.dateFormat },
    ];

    if (imagePreview) {
      changes.push({ key: "RESTAURANT_LOGO", value: imagePreview });
    }

    updateConfig({ configs: changes });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB original)
      if (file.size > 5 * 1024 * 1024) {
        alert(
          "La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB."
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to resize image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate new dimensions (max 400x400 while maintaining aspect ratio)
          let width = img.width;
          let height = img.height;
          const maxSize = 400;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Clear canvas with transparency
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Use PNG to preserve transparency
          const compressedImage = canvas.toDataURL("image/png");
          setImagePreview(compressedImage);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 ${isDark ? "text-white" : "text-gray-800"}`}>
        Cargando configuración...
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 rounded-lg border ${
    isDark
      ? "bg-[#0F172A] border-[#334155] focus:border-blue-500"
      : "bg-white border-gray-300 focus:border-[#275081]"
  } ${
    colors.text.primary
  } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
    isDark ? "focus:ring-blue-500" : "focus:ring-[#275081]"
  }`;

  const labelClass = `block text-sm font-semibold ${colors.text.muted} mb-2`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header con imagen corporativa */}
      <div
        className={`${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        } rounded-2xl p-8 shadow-xl border-2 transition-all`}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Logo Upload Section */}
          <div className="w-full lg:w-1/3">
            <h3 className={`text-lg font-bold ${colors.text.primary} mb-4`}>
              Imagen Corporativa
            </h3>
            <div className="relative">
              <div
                className={`w-full aspect-square rounded-xl border-2 border-dashed ${
                  isDark ? "border-[#334155]" : "border-gray-300"
                } flex items-center justify-center overflow-hidden ${
                  imagePreview ? "p-0" : "p-6"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview("")}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload
                      className={`w-12 h-12 mx-auto mb-2 ${colors.text.muted}`}
                    />
                    <p className={`text-sm ${colors.text.muted}`}>
                      Haz clic para subir
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Información del Restaurante */}
          <div className="flex-1 w-full">
            <div className="flex items-center mb-6">
              <div
                className={`p-3 rounded-xl ${
                  isDark ? "bg-blue-900/30" : "bg-blue-50"
                } mr-4`}
              >
                <Store
                  className={`w-7 h-7 ${
                    isDark ? "text-blue-400" : "text-[#275081]"
                  }`}
                />
              </div>
              <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
                Información de la empresa
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Nombre del Restaurante</label>
                <input
                  {...register("restaurantName")}
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Embutidos Coquito"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Dirección</label>
                <input
                  {...register("address")}
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Calle Bolívar #123"
                />
              </div>

              <div>
                <label className={labelClass}>Teléfono</label>
                <input
                  {...register("phone")}
                  type="tel"
                  className={inputClass}
                  placeholder="+591 ..."
                />
              </div>

              <div>
                <label className={labelClass}>NIT</label>
                <input
                  {...register("nit")}
                  type="text"
                  className={inputClass}
                  placeholder="Ej: 123456789"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración del Sistema */}
      <div
        className={`${
          isDark ? "bg-[#1E293B] border-[#334155]" : "bg-white border-gray-100"
        } rounded-2xl p-8 shadow-xl border-2`}
      >
        <div className="flex items-center mb-6">
          <div
            className={`p-3 rounded-xl ${
              isDark ? "bg-blue-900/30" : "bg-blue-50"
            } mr-4`}
          >
            <Database
              className={`w-7 h-7 ${
                isDark ? "text-blue-400" : "text-[#275081]"
              }`}
            />
          </div>
          <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
            Configuración del Sistema
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Zona Horaria</label>
            <select {...register("timezone")} className={inputClass}>
              <option value="America/La_Paz">Bolivia (UTC-4)</option>
              <option value="America/Bogota">Colombia (UTC-5)</option>
              <option value="America/Lima">Perú (UTC-5)</option>
              <option value="America/Argentina/Buenos_Aires">
                Argentina (UTC-3)
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Moneda</label>
            <select {...register("currency")} className={inputClass}>
              <option value="BOB">Boliviano (BOB)</option>
              <option value="USD">Dólar Americano (USD)</option>
              <option value="COP">Peso Colombiano (COP)</option>
              <option value="PEN">Sol Peruano (PEN)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Formato de Fecha</label>
            <select {...register("dateFormat")} className={inputClass}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón de guardar mejorado */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className={`
            px-8 py-3.5 rounded-xl font-semibold text-white text-base
            bg-gradient-to-r from-[#275081] to-[#F59E0B] 
            hover:shadow-2xl hover:scale-105 
            transition-all duration-300 
            flex items-center gap-3 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            shadow-lg shadow-blue-500/30
          `}
        >
          {isUpdating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </form>
  );
};
