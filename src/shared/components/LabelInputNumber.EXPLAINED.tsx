/**
 * ============================================================================
 * EXPLICACIÓN DETALLADA: LabelInputNumber.tsx
 * ============================================================================
 * 
 * Este componente es un INPUT DE NÚMERO reutilizable que se integra con
 * React Hook Form usando Controller para un control total del valor.
 * 
 * FLUJO GENERAL:
 * 1. El componente recibe props (control, name, error, etc.)
 * 2. Controller se conecta con React Hook Form
 * 3. El usuario escribe en el input
 * 4. Controller captura el cambio
 * 5. Se transforma de string → number
 * 6. Se actualiza el estado del formulario
 * 7. Zod valida el valor
 * 8. Si hay error, se muestra
 * ============================================================================
 */

// ============================================================================
// PASO 1: IMPORTS - Traemos las herramientas necesarias
// ============================================================================

import { 
  type FieldValues,  // Tipo base para cualquier formulario
  type Path,         // Tipo que garantiza que 'name' sea un campo válido del formulario
  type Control,      // Tipo del objeto 'control' de React Hook Form
  Controller         // Componente que conecta inputs personalizados con React Hook Form
} from 'react-hook-form';

import { type LucideIcon } from 'lucide-react';  // Tipo para iconos de Lucide

// ============================================================================
// PASO 2: INTERFACE - Definimos el contrato del componente
// ============================================================================

/**
 * Esta interface define QUÉ PROPS puede recibir el componente.
 * 
 * El genérico <T extends FieldValues> significa:
 * "T puede ser CUALQUIER tipo de formulario, pero debe extender FieldValues"
 * 
 * Ejemplo de uso:
 * Si tienes un formulario: { price: number, stock: number }
 * Entonces T = { price: number, stock: number }
 */
interface LabelInputNumberProps<T extends FieldValues> {
  // Props REQUERIDAS (sin '?')
  label: string;              // "Precio", "Stock", etc.
  name: Path<T>;              // Nombre del campo - Path<T> asegura que sea válido
  control: Control<T>;        // Objeto control de useForm() - conecta con React Hook Form
  
  // Props OPCIONALES (con '?')
  error?: string;             // Mensaje de error a mostrar
  type?: 'number';            // Tipo de input (siempre 'number' en este caso)
  placeholder?: string;       // Texto placeholder
  disabled?: boolean;         // Si el input está deshabilitado
  icon?: LucideIcon;          // Icono opcional a mostrar
  required?: boolean;         // Si muestra asterisco rojo
  min?: number;               // Valor mínimo permitido (HTML)
  max?: number;               // Valor máximo permitido (HTML)
  step?: number;              // Incremento (ej: 0.01 para decimales)
  className?: string;         // Clases CSS adicionales
}

// ============================================================================
// PASO 3: COMPONENTE - Función principal
// ============================================================================

/**
 * Este es el componente principal.
 * <T extends FieldValues> hace que el componente sea GENÉRICO
 * Lo que significa que puede trabajar con CUALQUIER formulario.
 */
export const LabelInputNumber = <T extends FieldValues>({
  // Aquí DESESTRUCTURAMOS las props que recibimos
  label,
  name,
  control,
  error,
  type = 'number',      // Valor por defecto
  placeholder,
  disabled = false,     // Valor por defecto
  icon: Icon,           // Renombramos 'icon' a 'Icon' (con mayúscula para usarlo como componente)
  required = false,     // Valor por defecto
  min,
  max,
  step = 1,            // Valor por defecto
  className = '',      // Valor por defecto
}: LabelInputNumberProps<T>) => {
  
  // ============================================================================
  // PASO 4: RENDER - Lo que el componente devuelve (el HTML/JSX)
  // ============================================================================
  
  return (
    // CONTENEDOR PRINCIPAL
    <div className={`space-y-2 ${className}`}>
      {/* ================================================================
          PASO 4.1: LABEL (Etiqueta del campo)
          ================================================================ */}
      <label 
        htmlFor={name}  // Conecta el label con el input por ID
        className="block text-sm font-medium text-gray-700"
      >
        {label}  {/* "Precio", "Stock", etc. */}
        
        {/* Si required=true, muestra asterisco rojo */}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* ================================================================
          PASO 4.2: CONTENEDOR DEL INPUT + ICONO
          ================================================================ */}
      <div className="relative group">
        {/* ICONO OPCIONAL (solo se renderiza si existe) */}
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#275081] transition-colors" />
        )}

        {/* ================================================================
            PASO 4.3: CONTROLLER - El corazón del componente
            ================================================================
            
            Controller es un componente de React Hook Form que:
            1. Se registra en el formulario con el 'name' especificado
            2. Recibe el 'control' que conecta con useForm()
            3. Usa 'render' para dar un componente personalizado
            4. Proporciona 'field' con métodos y valores
            ================================================================ */}
        <Controller
          name={name}        // Nombre del campo en el formulario
          control={control}  // Conexión con React Hook Form
          
          /**
           * RENDER PROP FUNCTION
           * Esta función recibe un objeto con 'field' que contiene:
           * - value: el valor actual del campo
           * - onChange: función para cambiar el valor
           * - onBlur: función cuando pierde foco
           * - name: nombre del campo
           * - ref: referencia al elemento
           */
          render={({ field: { onChange, value, ...field } }) => (
            /**
             * ============================================================
             * PASO 4.4: INPUT - El elemento HTML real
             * ============================================================
             * 
             * Aquí desestructuramos 'field' en:
             * - onChange: Lo extraemos para customizarlo
             * - value: Lo extraemos para customizarlo
             * - ...field: El resto (onBlur, name, ref) se esparcen
             * 
             * ¿Por qué extraemos onChange y value?
             * Porque necesitamos transformar el valor de STRING a NUMBER
             * ============================================================
             */
            <input
              // ESPARCE el resto de field (onBlur, name, ref)
              {...field}
              
              // ID para conectar con el label
              id={name}
              
              // TIPO de input (siempre 'number')
              type={type}
              
              /**
               * ========================================================
               * VALUE CUSTOMIZADO
               * ========================================================
               * value ?? '' significa:
               * - Si value existe (no es null/undefined) → usa value
               * - Si value es null/undefined → usa string vacío ''
               * 
               * ¿Por qué?
               * React no permite que un input controlado tenga value=null
               * Debe ser siempre un string o número
               * ========================================================
               */
              value={value ?? ''}
              
              /**
               * ========================================================
               * ONCHANGE CUSTOMIZADO - AQUÍ ESTÁ LA MAGIA ✨
               * ========================================================
               * Este es el proceso de transformación:
               * 
               * 1. Usuario escribe "123" en el input
               * 2. onChange se dispara con el evento (e)
               * 3. Extraemos el valor: e.target.value = "123" (string)
               * 4. Guardamos en 'val': const val = "123"
               * 5. Verificamos si está vacío
               * 6a. Si val === '' → enviamos undefined
               * 6b. Si val !== '' → parseFloat("123") → 123 (number)
               * 7. onChange(123) actualiza React Hook Form
               * 8. React Hook Form actualiza su estado interno
               * 9. Zod valida el nuevo valor
               * 10. Si hay error, se actualiza formState.errors
               * 
               * ¿Por qué parseFloat y no parseInt?
               * parseFloat permite decimales: "12.5" → 12.5
               * parseInt solo enteros: "12.5" → 12
               * ========================================================
               */
              onChange={(e) => {
                // PASO 1: Obtener el valor como string
                const val = e.target.value;
                
                // PASO 2: Transformar y enviar a React Hook Form
                onChange(
                  val === ''           // Si está vacío
                    ? undefined        // Enviar undefined (campo sin valor)
                    : parseFloat(val)  // Convertir string → number
                );
              }}
              
              /**
               * ========================================================
               * CLASES CSS DINÁMICAS
               * ========================================================
               * Usa template literals para clases condicionales:
               * - Si Icon existe → pl-12 (padding-left más grande)
               * - Si no hay Icon → pl-4 (padding-left normal)
               * - Si hay error → borde rojo
               * - Si no hay error → borde normal
               * ========================================================
               */
              className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl border-2 ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-[#275081] focus:ring-[#275081]/10'
              } focus:ring-4 outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50`}
              
              // Props estándar del input
              placeholder={placeholder}
              disabled={disabled}
              min={min}      // Mínimo permitido (validación HTML)
              max={max}      // Máximo permitido (validación HTML)
              step={step}    // Incremento (ej: 0.01 para centavos)
              
              /**
               * ========================================================
               * ARIA ATTRIBUTES - Accesibilidad
               * ========================================================
               * Estos atributos ayudan a lectores de pantalla
               * aria-invalid: indica si el campo tiene error
               * aria-describedby: conecta con el mensaje de error
               * ========================================================
               */
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          )}
        />
      </div>

      {/* ================================================================
          PASO 4.5: MENSAJE DE ERROR (solo se muestra si hay error)
          ================================================================ */}
      {error && (
        <p 
          id={`${name}-error`}  // ID para aria-describedby
          className="text-red-600 text-xs mt-1" 
          role="alert"  // Para lectores de pantalla
        >
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * FLUJO COMPLETO DE EJEMPLO
 * ============================================================================
 * 
 * Supongamos que tienes este formulario:
 * 
 * ```typescript
 * const schema = zod.object({
 *   price: zod.number().min(0).max(1000)
 * });
 * 
 * type FormData = zod.infer<typeof schema>;
 * 
 * const { control, formState: { errors } } = useForm<FormData>({
 *   resolver: zodResolver(schema)
 * });
 * 
 * <LabelInputNumber
 *   label="Precio"
 *   name="price"
 *   control={control}
 *   error={errors.price?.message}
 * />
 * ```
 * 
 * FLUJO CUANDO EL USUARIO ESCRIBE:
 * 
 * 1. INICIAL:
 *    - value = undefined
 *    - Input muestra: "" (vacío)
 * 
 * 2. USUARIO ESCRIBE "5":
 *    - onChange se dispara
 *    - val = "5" (string)
 *    - parseFloat("5") = 5 (number)
 *    - onChange(5) actualiza React Hook Form
 *    - value = 5
 *    - Input muestra: "5"
 *    - Zod valida: 5 >= 0 && 5 <= 1000 → ✅ válido
 *    - errors.price = undefined
 * 
 * 3. USUARIO ESCRIBE "0" (ahora es "50"):
 *    - onChange se dispara
 *    - val = "50" (string)
 *    - parseFloat("50") = 50 (number)
 *    - onChange(50) actualiza React Hook Form
 *    - value = 50
 *    - Input muestra: "50"
 *    - Zod valida: 50 >= 0 && 50 <= 1000 → ✅ válido
 *    - errors.price = undefined
 * 
 * 4. USUARIO ESCRIBE "00" (ahora es "5000"):
 *    - onChange se dispara
 *    - val = "5000" (string)
 *    - parseFloat("5000") = 5000 (number)
 *    - onChange(5000) actualiza React Hook Form
 *    - value = 5000
 *    - Input muestra: "5000"
 *    - Zod valida: 5000 > 1000 → ❌ inválido
 *    - errors.price = { message: "Number must be less than or equal to 1000" }
 *    - El componente muestra el error en rojo
 * 
 * 5. USUARIO BORRA TODO:
 *    - onChange se dispara
 *    - val = "" (string vacío)
 *    - onChange(undefined) actualiza React Hook Form
 *    - value = undefined
 *    - Input muestra: "" (vacío)
 *    - Zod valida: undefined (campo requerido?) → depende del schema
 * 
 * ============================================================================
 * VENTAJAS DE USAR CONTROLLER
 * ============================================================================
 * 
 * 1. TRANSFORMACIÓN DE VALORES:
 *    - Podemos convertir string → number automáticamente
 *    - El formulario siempre tiene el tipo correcto
 * 
 * 2. CONTROL TOTAL:
 *    - Podemos customizar onChange completamente
 *    - Podemos aplicar lógica adicional
 * 
 * 3. COMPATIBILIDAD:
 *    - Funciona con cualquier componente personalizado
 *    - React Hook Form recomienda Controller para componentes custom
 * 
 * 4. VALIDACIÓN:
 *    - Zod recibe el valor correcto (number, no string)
 *    - Las validaciones funcionan perfectamente
 * 
 * ============================================================================
 * DIFERENCIA CON REGISTER
 * ============================================================================
 * 
 * CON REGISTER (no recomendado para números):
 * ```typescript
 * <input type="number" {...register('price', { valueAsNumber: true })} />
 * ```
 * - Menos control
 * - Configuración limitada
 * - Difícil customizar transformaciones
 * 
 * CON CONTROLLER (recomendado):
 * ```typescript
 * <Controller
 *   name="price"
 *   control={control}
 *   render={({ field }) => <input {...field} />}
 * />
 * ```
 * - Control total
 * - Transformaciones customizadas
 * - Fácil agregar lógica adicional
 * 
 * ============================================================================
 */

