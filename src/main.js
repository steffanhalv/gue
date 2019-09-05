import Vue from 'vue'
import App from './App.vue'
import router from './router'
import storage from './code/storage'

Vue.config.productionTip = false
Vue.prototype.store = storage

new Vue({
  router,
  render: h => h(App)
}).$mount('#gue')
