import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ✅ dùng cho alias

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ alias @ trỏ tới src
    },
  },
});
