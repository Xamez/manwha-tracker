import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon'],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['@/assets/css/tailwind.css', '@/assets/css/global.css'],
  runtimeConfig: {
    mongodbUri: '', // Provided via NUXT_MONGODB_URI env variable
    jwtSecret: '', // Provided via NUXT_JWT_SECRET env variable
    public: {
      env: '', // Provided via NUXT_PUBLIC_ENV env variable
    },
  },
})
