import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/vyvo/",
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  server: {
    port: 5175,
  },
});
