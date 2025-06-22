<template>
  <NavBar
    fixed
    placeholder
    safe-area-inset-top
    :title="title"
    @click-left="$router.back()"
  >
    <template #left>
      <div id="narBarLeft"></div>
    </template>
    <template #right>
      <div id="narBarRight"></div>
    </template>
  </NavBar>
  <router-view />
</template>

<script setup>
import { computed } from "vue";
import { NavBar } from "vant";
import { useRoute } from "vue-router";
import { useBackButtonHandler } from "@/hooks/useBackButtonHandler";
useBackButtonHandler();
const route = useRoute();
const title = computed(() => route.name);
</script>
<style lang="css">
:root:root {
  --van-nav-bar-height: 60px;
  --van-nav-bar-arrow-size: 45px;

  --van-action-bar-background: ;
  --van-action-bar-height: 60px;
  --van-action-bar-icon-width: 60px;
  --van-action-bar-icon-size: 20px;
  --van-action-bar-icon-font-size: 12px;
}
</style>
