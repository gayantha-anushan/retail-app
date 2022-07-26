import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import vueHtmlToPaper from 'vue-html-to-paper';
import store from './store'
import './registerServiceWorker'



Vue.config.productionTip = false

Vue.use(vueHtmlToPaper)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
