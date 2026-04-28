import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ✨ 1. O COFRE-FORTE DE CACHE (SWR -> ISR) ✨

  // ✨ 2. MOTOR OTIMIZADO PARA O BUN ✨
  nitro: {
    preset: 'bun'
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // A MAGIA DOS ÍCONES
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/primeicons/primeicons.css'
        }
      ]
    }
  },
  
  components: {
    dirs: [
      {
        path: '~/components',
        global: true 
      }
    ]
  },
  
  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})