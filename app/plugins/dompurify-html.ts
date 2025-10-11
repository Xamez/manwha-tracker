import vueDompurifyHTMLPlugin from 'vue-dompurify-html';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(vueDompurifyHTMLPlugin);
});
