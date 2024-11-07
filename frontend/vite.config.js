import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // use this to automatically add the target for running the frontend pages
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000"
      }
    }
  }
})
