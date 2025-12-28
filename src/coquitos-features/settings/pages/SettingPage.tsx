import { FormSystemConfig } from "../components/FormSystemConfig";

export const SettingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800">
          Configuración
        </h1>
      </div>

      <FormSystemConfig />
    </div>
  );
};
