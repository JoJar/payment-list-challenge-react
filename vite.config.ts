import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
      allowedHosts: [
        '.vm-provider.internal',
        'hrcdn.net'
      ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
