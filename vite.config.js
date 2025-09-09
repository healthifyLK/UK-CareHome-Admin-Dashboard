import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { hostname } from 'os'

// https://vite.dev/config/
export default defineConfig({
  server :{
    host: '0.0.0.0'
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
