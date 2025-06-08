<template>
  <NavBar
    safe-area-inset-top
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="$router.back()"
  >
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

const route = useRoute();
const title = computed(() => route.name);
</script>
