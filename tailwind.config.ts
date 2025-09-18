import type { Config } from 'tailwindcss'
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Configuración personalizada para el scrollbar
      scrollbar: {
        thin: 'thin',
        track: 'transparent',
        thumb: 'rgb(209 213 219)', // gray-300
        'thumb-hover': 'rgb(156 163 175)', // gray-400
      }
    },
  },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
  ],
} satisfies Config
