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
const Categories = (resolve) => {
  import('../conponents/Categories').then((module) => {
    resolve(module)
  })
}
const Params = (resolve) => {
  import('../conponents/Params').then((module) => {
    resolve(module)
  })
}
const Goods = (resolve) => {
  import('../conponents/goods').then((module) => {
    resolve(module)
  })
}
const Add = (resolve) => {
  import('../conponents/Add').then((module) => {
    resolve(module)
  })
}
const Order = (resolve) => {
  import('../conponents/Order').then((module) => {
    resolve(module)
  })
}
const Reports = (resolve) => {
  import('../conponents/Reports').then((module) => {
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
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Reports }
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
