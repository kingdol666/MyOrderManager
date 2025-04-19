import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ManuManger from "../views/ManuManager.vue"
import CategoryManager from '../views/CategoryManager.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/ManuManger',
    name: 'ManuManger',
    component: ManuManger
  },
  {
    path: '/CategoryManager',
    name: 'CategoryManager',
    component: CategoryManager
  }
]
 
const router = createRouter({
    history: createWebHistory(),
    routes
})
 
export default router