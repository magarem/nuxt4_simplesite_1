import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  // ✨ A MAGIA DOS ÍCONES: Injetamos o CSS do PrimeIcons diretamente no cabeçalho (head) do site
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
        global: true // ✨ A MÁGICA ESTÁ AQUI ✨
      }
    ]
  },
  // Apontamos para o nosso ficheiro CSS principal
  css: ['~/assets/css/main.css'],
  
  // No Tailwind v4, a integração é feita através de um plugin do Vite!
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})