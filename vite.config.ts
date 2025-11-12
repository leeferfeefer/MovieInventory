import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});