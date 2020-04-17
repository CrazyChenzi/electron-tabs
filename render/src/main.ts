import Vue from 'vue'
import App from './App.vue'
import * as $electron from './ipcRenderer'

Vue.config.productionTip = false

if (window.navigator.userAgent.includes('Electron')) {
  Vue.prototype.$electron = $electron
}

new Vue({
  render: (h) => h(App),
}).$mount('#app')
