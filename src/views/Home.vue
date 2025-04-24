<template>
    <div>
        <el-button type="primary" @click="goToMain">进入管理系统</el-button>

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders, getMenuItems } from '../api'
const router = useRouter()
const goToMain = () => {
    router.push('/main')
}

import { useMainStore } from '../store'

const store = useMainStore()

onMounted(
async () => {
  try {
    const menuItems = await getMenuItems();
    // **在这里也加个日志，确认 await 之后 menuItems 的值**
    console.log('await getMenuItems() 之后 menuItems 的值:', menuItems);

    // **增加一个检查，看 menuItems 是否是你期望的类型（比如数组）并且有内容**
    if (menuItems && Array.isArray(menuItems) && menuItems.length > 0) {
      console.log('菜单项数据:', menuItems);
      store.setProducts(menuItems);
    } else {
      // 如果 menuItems 是空数组、null、undefined 或非数组，会进入这里
      console.warn('获取到的 menuItems 无效或为空:', menuItems);
      // 这里可以根据业务逻辑决定是否继续执行 store.setProducts 等
      // 可能需要提示用户或执行备用逻辑
    }
    const orders = await getOrders();
    // **在这里也加个日志，确认 await 之后 orders 的值**
    console.log('await getOrders() 之后 orders 的值:', orders);
    store.setOrders(orders);

    console.log('store.setOrders() 之后的状态:', store.getOrder());
  } catch (error) {
    console.error('获取菜单项失败 (外部 catch):', error);
  }
}
)
</script>

<style lang="scss" scoped>

</style>
