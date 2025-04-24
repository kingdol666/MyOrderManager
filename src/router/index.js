import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import MainLayout from '@/components/MainLayout.vue'
import ManuManger from '@/views/ManuManager.vue'
import OrderManager from '@/views/OrderManager.vue'
import CategoryManager from '@/views/CategoryManager.vue'
import Login from '@/views/Login.vue'
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/main',
    name: 'Main',
    component: MainLayout,
    redirect: '/main/ManuManger',
    children: [
      {
        path: 'ManuManger',
        name: 'ManuManger',
        component: ManuManger
      },
      {
        path: 'CategoryManager',
        name: 'CategoryManager',
        component: CategoryManager
      },
      {
        path: 'OrderManager',
        name: 'OrderManager',
        component: OrderManager
      }
    ]
  }
]
 
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (to.path !== '/login' && !isLoggedIn) {
    // 如果用户未登录且尝试访问非登录页面，则重定向到登录页
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    // 如果用户已登录且尝试访问登录页面，则重定向到主页
    next('/main');
  } else {
    // 其他情况正常放行
    next();
  }
});

export default router;