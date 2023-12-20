import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    server: {
      host: "0.0.0.0",
      port: "5500",
      strictPort: true,
    },
    plugins: [react()],
  });
};
