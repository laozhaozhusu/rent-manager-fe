import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "首页",
    meta: {
      rightText: "首页",
    },
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/user",
    name: "我的",
    meta: {
      rightText: "我的",
    },
    component: () => import("@/views/user/index.vue"),
  },
  {
    path: "/building",
    name: "楼栋列表",
    meta: {
      rightText: "添加地址",
    },
    component: () => import("@/views/building/index.vue"),
  },
  {
    path: "/room/:buildId",
    name: "房间列表",
    meta: {
      rightText: "添加房间",
    },
    component: () => import("@/views/room/index.vue"),
  },
  {
    path: "/room",
    name: "未开收据房间列表",
    meta: {
      rightText: "添加房间",
    },
    component: () => import("@/views/room/index.vue"),
  },
  {
    path: "/rent/:roomId",
    name: "单据信息",
    meta: {
      rightText: "新增单据",
    },
    component: () => import("@/views/rent/index.vue"),
  },
  {
    path: "/rent/add",
    name: "新增单据",
    component: () => import("@/views/rent/AddRent.vue"),
  },
  {
    path: "/rent/detail/:rentId",
    name: "单据详情",
    component: () => import("@/views/rent/AddRent.vue"),
  },
  {
    path: "/rent/preview/:rentId",
    name: "单据预览",
    component: () => import("@/views/rent/ReceiptPreview.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes,
});

router.afterEach((to, from) => {
  console.log(`Navigated from ${from.fullPath} to ${to.fullPath}`);
  console.log("Window history length:", window.history.length);
});

export default router;
