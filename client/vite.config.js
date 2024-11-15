import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto hace que el servidor escuche en todas las interfaces de red
    port: 8000, // Puedes cambiar el puerto si ya estÃ¡ en uso
  },
});
