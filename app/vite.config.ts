import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split only the heaviest, dependency-leaf vendor (Supabase) into its
        // own chunk. React / react-router and UI libs are left to Rollup's
        // automatic chunking to avoid cross-chunk circular init (TDZ) errors.
        manualChunks(id) {
          if (id.includes("/node_modules/@supabase/supabase-js")) {
            return "vendor-supabase";
          }
        },
      },
    },
  },
});
