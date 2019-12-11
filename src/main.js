import Vue from 'vue'
import App from './App.vue'
import server from '@/logic/server'
import vdom from '@/logic/vdom'

Vue.prototype.$server = server
Vue.prototype.$vdom = vdom
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
