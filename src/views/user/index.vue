<template>
  <div class="app-container">
    <div class="settings-container">
      <CellGroup>
        <Cell title="个人信息" />
        <Cell title="修改密码" />
        <Cell title="退出登录" is-link @click="logout" />
      </CellGroup>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { App } from "@capacitor/app";
import { CellGroup, Cell } from "vant";
import Footer from "@/components/Footer/index.vue";

const active = ref(1); // 默认选中“我的”菜单

const logout = () => {
  App.exitApp();
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.settings-container {
  padding: 16px;
  background-color: #f8f8f8;
  flex: 1;
}
</style>
