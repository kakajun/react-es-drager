import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    port: 6183
  },
  plugins: [react()]
})
