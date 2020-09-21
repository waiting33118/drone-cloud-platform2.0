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
  }
]

const router = new VueRouter({
  routes
})

export default router
