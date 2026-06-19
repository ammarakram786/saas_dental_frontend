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

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiBase: 'http://127.0.0.1:5500',
    // nuxt-auth-utils session cookie settings.
    session: {
      cookie: {
        // Over plain http (dev/LAN) a Secure cookie is rejected by the
        // browser, so only mark it Secure in production (served over https).
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  devServer: {
    host: '0.0.0.0', // '0.0.0.0' listens on all local interfaces (useful for Docker/LAN testing)
    port: 5005       // Change this to your desired port number
  }
})
    