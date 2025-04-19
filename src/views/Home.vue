<template>
    <div>
22
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getMenuItems } from '../api'

import { useMainStore } from '../store'

const store = useMainStore()

onMounted(
  // 改进调用处的 catch 块
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
  } catch (error) {
    console.error('获取菜单项失败 (外部 catch):', error);
  }
}
)
</script>

<style lang="scss" scoped>

</style>
