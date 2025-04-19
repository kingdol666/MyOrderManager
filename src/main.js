import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import axios from './utils/axios'

const app = createApp(App)
const pinia = createPinia()

// 全局挂载axios
app.config.globalProperties.$axios = axios
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
