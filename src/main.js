import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入样式代码
import './assets/css/base.scss'
// 引入fonts
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false
// 全局过滤器
Vue.filter('formartTime', function (time) {
  const date = new Date(time)
  const y = date.getFullYear()
  const m = ('0' + (date.getMonth() + 1)).slice(-2)
  const d = ('0' + (date.getDate())).slice(-2)

  const yy = ('0' + (date.getHours())).slice(-2)
  const mm = ('0' + (date.getMinutes())).slice(-2)
  const ss = ('0' + date.getSeconds()).slice(-2)
  return `${y}-${m}-${d} ${yy}:${mm}:${ss}`
})

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
