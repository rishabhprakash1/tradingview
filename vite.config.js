import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Deployment target: https://trading.kolabix.com  (custom domain via CNAME)
//
// Because we use a CUSTOM domain (not a GitHub Pages subpath like
// username.github.io/repo-name), the base URL stays '/' — Vite does NOT need
// a repo-name prefix. If you ever switch to a plain github.io URL without a
// custom domain, set base to '/tradingview/'.
export default defineConfig({
  plugins: [react()],
  base: '/',          // root-relative — correct for custom domain deployments
  build: {
    outDir: 'dist',   // gh-pages deploys this folder
  },
})

