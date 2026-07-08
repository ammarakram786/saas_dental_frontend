// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  // Nested stores (e.g. app/stores/platform/*) are not scanned by default.
  // Paths are resolved against Nuxt's app directory, so use "stores/**".
  pinia: {
    storesDirs: ['stores/**'],
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://127.0.0.1:5500',
    // nuxt-auth-utils session cookie settings.
    // NUXT_SESSION_PASSWORD must be set (32+ chars) or setUserSession throws "Empty password".
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || '',
      cookie: {
        // Site currently serves over HTTP via nginx :80.
        // Secure cookies are dropped by browsers on plain HTTP.
        secure: process.env.NUXT_SESSION_SECURE === 'true',
      },
    },
  },
  devServer: {
    host: '0.0.0.0', // '0.0.0.0' listens on all local interfaces (useful for Docker/LAN testing)
    port: 3030
  }
})
    