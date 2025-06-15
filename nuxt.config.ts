import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Configuração do Vite com plugin Tailwind
  vite: {
    plugins: [tailwindcss()]
  },

  // Módulos necessários (removido @nuxtjs/tailwindcss)
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt'
  ],

  // Configuração do PostCSS
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },

  // Configuração do UI
  ui: {
    global: true,
    icons: ['heroicons', 'mdi'],
    notifications: { position: 'top-0 bottom-auto', duration: 5000 },

  },

  // Configuração do Supabase
  // Configuração do Supabas
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['*']
    }
  },

  // Configuração de runtime
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      mapboxKey: process.env.NUXT_PUBLIC_MAPBOX_KEY
    },
    smtp: {
      host: process.env.SMTP_HOST,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },

  // Configuração do CSS
  css: ['~/assets/css/main.css'],

  // Configuração do cabeçalho
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1'
    }
  }
})
