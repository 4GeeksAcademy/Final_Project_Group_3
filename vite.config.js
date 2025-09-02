import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND = 'https://<YOUR-ID>-5000.app.github.dev'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: BACKEND, changeOrigin: true, secure: true } }
  }
})
