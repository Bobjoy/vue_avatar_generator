import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'

Vue.use(VueMeta)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
