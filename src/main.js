import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入样式代码
import './assets/css/base.scss'
// 引入fonts
import './assets/fonts/iconfont.css'
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
