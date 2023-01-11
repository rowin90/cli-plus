import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/bd': {
        target: 'http://api.fanyi.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bd/, ''),
      },
    }
  }
})
