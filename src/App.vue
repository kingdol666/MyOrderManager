<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: 60px; line-height: 60px;">
        <Header />
      </el-header>
      <el-container>
        <el-aside style="width: 220px; ">
          <Aside />
        </el-aside>
        <el-main class="main-content" style="overflow: auto; padding: 20px;">
          <transition name="page-transition">
            <router-view v-slot="{ Component }">
              <component :is="Component" />
            </router-view>
          </transition>
          <div v-if="isLoading" class="progress-bar"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="js" setup>
import Header from "./components/Header.vue"
import Aside from "./components/Aside.vue"
</script>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  flex: 1;
  display: flex;
}

.el-header {
  background-color: #409EFF;
  color: #fff;
  box-shadow: 0 1px 4px rgba(209, 172, 7, 0.1);
}

.el-aside {
  transition: width 0.3s;
  overflow: hidden;
}

.main-content {
  flex: 1;
  background-color: #ffffff;
}
</style>
