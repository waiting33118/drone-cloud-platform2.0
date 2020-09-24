import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from './../views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout
  },
  {
    path: '/client',
    name: 'Client',
    component: () => import('./../views/Client.vue')
  },
  {
    path: '/authorize',
    beforeEnter () { location.href = 'https://140.124.71.226:3030' }
  }
]

const router = new VueRouter({
  routes
})

export default router
