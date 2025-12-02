import { defineConfig } from 'vite';


export default ({
    root: "./public",
    server: {
        port: 5173,
    },

    build: {
        outDir: '../dist',
        emptyOutDir: true,
    }
});
