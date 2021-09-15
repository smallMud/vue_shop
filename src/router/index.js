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
const Welcome = (resolve) => {
  import('../conponents/Welcome').then((module) => {
    resolve(module)
  })
}
const User = (resolve) => {
  import('../conponents/user').then((module) => {
    resolve(module)
  })
}
const Rights = (resolve) => {
  import('../conponents/Rights').then((module) => {
    resolve(module)
  })
}
const Roles = (resolve) => {
  import('../conponents/Roles').then((module) => {
    resolve(module)
  })
}
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/Welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
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
