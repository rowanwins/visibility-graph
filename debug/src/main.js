import Vue from 'vue'
import App from './App.vue'
import VueWorker from 'vue-worker'
import iview from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(VueWorker)
Vue.use(iview)

new Vue({
  el: '#app',
  render: h => h(App)
})
