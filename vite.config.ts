import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const previewHost = process.env.FREECODE_PREVIEW_HOST

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: previewHost ? [previewHost, 'localhost', '127.0.0.1'] : true,
  },
})
