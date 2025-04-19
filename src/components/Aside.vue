<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :value="false">expand</el-radio-button>
    <el-radio-button :value="true">collapse</el-radio-button>
  </el-radio-group>
  <el-menu
    :default-active="$route.path"
    :collapse="isCollapse"
    active-text-color="red"
    router
    class="el-menu-vertical-demo"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <icon-menu />
        </el-icon>
        <span>功能目录</span>
      </template>
      <el-menu-item-group>
        <template #title><span>测试</span></template>
        <el-menu-item index="/about" :route="{ path: '/about' }">
          <el-icon>
            <User />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/" :route="{ path: '/' }">
          <el-icon>
            <User />
          </el-icon>
          <span>用户Home</span>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="管理系统">
        <el-menu-item index="/CategoryManager" :route="{ path: '/CategoryManager' }">
          <el-icon>
            <User />
          </el-icon>
          <span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/ManuManger" :route="{ path: '/ManuManger' }">
          <el-icon>
            <User />
          </el-icon>
          <span>菜单管理</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>

    <el-menu-item index="2">
      <el-icon>
        <setting />
      </el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
