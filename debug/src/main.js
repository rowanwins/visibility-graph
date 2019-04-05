import Vue from 'vue'
import App from './App.vue'
import VueWorker from 'vue-worker'

Vue.use(VueWorker)
new Vue({
  el: '#app',
  render: h => h(App)
})
