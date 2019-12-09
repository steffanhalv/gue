import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.store = storage

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
