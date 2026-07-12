import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /api se redirige al backend local (puerto 3000).
// En producción (Vercel) el frontend y el backend comparten dominio,
// asi que /api funciona directo sin tocar nada.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
