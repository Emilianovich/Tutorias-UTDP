import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: resolve(__dirname, "public"),

    publicDir: resolve(__dirname, "public"),

    server: {
        port: 5173,
    },

    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        copyPublicDir: true,
        rollupOptions: {
            input: resolve(__dirname, "public/index.html"),
        },
    },
});
