import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 11012,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:11013",
      "/mcp": {
        target: "http://localhost:11013",
        ws: true,
      },
    },
  },
  resolve: {
    alias: { "@": "./src" },
  },
});
