export default defineNuxtConfig({
  modules: ["@vercel/analytics"],

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Estate & Estate | Considered homes, thoughtfully found",
      meta: [
        {
          name: "description",
          content: "A considered approach to finding your next home.",
        },
      ],
    },
  },
});
