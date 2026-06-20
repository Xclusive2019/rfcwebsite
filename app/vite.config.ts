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
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (["react", "react-dom", "react-router-dom"].some((pkg) => id.includes(`/node_modules/${pkg}`))) {
              return "vendor-react";
            }
            if (id.includes("@supabase/supabase-js")) {
              return "vendor-supabase";
            }
            if (["sonner", "clsx", "tailwind-merge", "class-variance-authority"].some((pkg) => id.includes(`/node_modules/${pkg}`))) {
              return "vendor-ui";
            }
          }
          if (id.includes("/src/pages/")) {
            return "pages";
          }
        },
      },
    },
  },
});
