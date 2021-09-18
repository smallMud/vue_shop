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

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
