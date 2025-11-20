// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/app.css'],

  app: {
    head: {
      title: 'TODO List - Organize Your Tasks',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A beautiful and modern TODO list application built with Nuxt 4' }
      ]
    }
  }
})
