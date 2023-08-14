import env from 'dotenv'

const log = { debug: console.log }

env.config()

export default defineNuxtConfig({
  devtools: { enabled: true },
  components: false,
  modules: ['@pinia/nuxt'],
  vite: {
    server: {
      hmr: {
        path: '/hmr',
        clientPort: Number(String(process.env['VITE_HMR_CLIENT_PORT'] || '24678'))
      },
      proxy: {
        '^/api/.*': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          // rewrite: (path) => {
          //   return path.replace(/^\/api\//g, '/');
          // }
        }
      }
    },
  },
  css: [
    '@/assets/css/globals.scss',
    'bootstrap/dist/css/bootstrap.css',
  ],
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore'],
    ],
  },
})
