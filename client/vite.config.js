import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      host: "0.0.0.0",
      port: "5500",
      strictPort: true,
      proxy: {
        "/api": {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api/, process.env.VITE_API_BASE_URL + "/api"),
        },
      },
    },
    plugins: [react()],
  });
};
