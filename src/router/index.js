import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = (resolve) => {
  import('../views/Login').then((module) => {
    resolve(module)
  })
}
const Home = (resolve) => {
  import('../views/Home').then((module) => {
    resolve(module)
  })
}
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '.login') next('/login')
  const token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') return next('/login')
  next()
})

export default router
