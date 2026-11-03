import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 5173 (Vite's default) is used by another program on the demo laptop, so we use 5288.
// If 5288 is ever busy too, Vite moves to the next free port instead of stopping.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5288, strictPort: false },
  preview: { port: 5289, strictPort: false },
});
