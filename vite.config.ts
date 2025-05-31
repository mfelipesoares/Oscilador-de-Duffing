import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Oscilador-de-Duffing/', // ajuste aqui
  plugins: [react()],
})
