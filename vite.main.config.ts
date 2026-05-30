import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'electron',
        'better-sqlite3',
        'bindings',
        'file-uri-to-path',
        '@prisma/client',
        '@prisma/adapter-better-sqlite3',
        'node:path',
        'node:fs',
        'node:os',
      ],
    },
  },
});