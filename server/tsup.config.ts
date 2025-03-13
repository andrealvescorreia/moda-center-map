import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['./src/**/*.ts'],
  format: 'esm',
  outDir: 'dist',
  clean: true, //deleta a pasta dist antiga e recria do zero
})
