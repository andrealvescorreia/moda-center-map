import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/server.ts'],
  format: 'cjs',
  outDir: 'dist',
  clean: true, //deleta a pasta dist antiga e recria do zero
})
