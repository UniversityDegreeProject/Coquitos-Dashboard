
export const getEnvsAdapter = {
  API_URL: import.meta.env.VITE_API_URL || 'https://transferable-lawana-roadworthy.ngrok-free.dev/api',
} as const;