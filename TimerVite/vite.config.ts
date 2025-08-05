import { defineConfig } from 'vite';

export default defineConfig({
  base:'./',
  server: {
    host: true,   // permette di ascoltare su tutte le interfacce (0.0.0.0)
  },
});