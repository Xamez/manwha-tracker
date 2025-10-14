import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '0 */4 * * *': ['manwha:retrieveLastChapters'],
    },
  },
  modules: ['@nuxt/icon', '@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css', '@/assets/css/global.css'],
  runtimeConfig: {
    mongodbUri: '', // Provided via NUXT_MONGODB_URI env variable
    jwtSecret: '', // Provided via NUXT_JWT_SECRET env variable
    public: {
      env: '', // Provided via NUXT_PUBLIC_ENV env variable
    },
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [tailwindcss()],
  },
});
