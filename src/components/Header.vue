<template>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <img
          style="width: 50px"
          src="../assets/vue.svg"
          alt="Element logo"
        />
      </el-menu-item>
      <el-menu-item index="1">工作台</el-menu-item>  
      <el-menu-item index="2">个人中心</el-menu-item>
    </el-menu>
  </template>
  
<script lang="ts" setup>
  import { ref } from 'vue'
  
  const activeIndex = ref('1')
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const handleSelect = (key: string) => {
    switch(key) {
      case '1':
        router.push('/')
        break
      case '2':
        router.push('/about')
        break
    }
  }
  </script>
  
  <style scoped>
  .el-menu--horizontal > .el-menu-item:nth-child(1) {
    margin-right: auto;
  }
  </style>
