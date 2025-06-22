<template>
  <Tabbar v-model="active">
    <TabbarItem name="首页" icon="home-o">首页</TabbarItem>
    <TabbarItem name="楼栋列表" icon="hotel-o">楼栋</TabbarItem>
    <TabbarItem name="我的" icon="user-o">我的</TabbarItem>
  </Tabbar>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Tabbar, TabbarItem } from "vant";
const router = useRouter();
const route = useRoute();
const active = ref(route.name);

watch(
  () => active.value,
  (page) => {
    router.push({ name: page });
  }
);
</script>
