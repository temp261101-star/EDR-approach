import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),tailwindcss()],
    base: '/',  
  server: {
    historyApiFallback: true,
    proxy: {
       
      "/api/proxy": {
        target: "http://182.48.194.218:9191/api/v1",
        changeOrigin: true,
      
        rewrite: (path) => path.replace(/^\/api\/proxy/, ""),
      },
    },
  },
});