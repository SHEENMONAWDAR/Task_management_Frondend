import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  esbuild: {
    loader: "jsx", // allow JSX in .js files
    include: /src\/.*\.[jt]sx?$/, // process js, jsx, ts, tsx in src
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
});
