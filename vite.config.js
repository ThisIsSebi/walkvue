import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    vuetify(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        //target: "http://localhost:8080", 
        target: "https://orange-tree-04a9a8c03.6.azurestaticapps.net", 
        changeOrigin: true,
        secure: false, // Disable SSL verification (useful for development)
      },
    },
  },
});
