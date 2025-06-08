import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/building",
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
    path: "/room",
    name: "房间列表",
    meta: {
      rightText: "添加房间",
    },
    component: () => import("@/views/room/index.vue"),
  },
  {
    path: "/rent",
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
    path: "/rent/preview",
    name: "单据预览",
    component: () => import("@/views/rent/ReceiptPreview.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes,
});

export default router;
