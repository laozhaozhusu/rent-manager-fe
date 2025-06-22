import { createApp } from "vue";
// import { App as CapacitorApp } from "@capacitor/app";
import App from "./App.vue";
import router from "@/router/index";
import { createPinia } from "pinia";
import { piniaPersistIndexedDB } from "./plugins/piniaPersistIndexedDB";
import "vant/lib/index.css";
import vConsole from "vconsole";
import Footer from "@/components/Footer/index.vue";
import { Notify } from "vant";

if (import.meta.env.MODE !== "prod") {
  new vConsole();
}
const pinia = createPinia();
pinia.use(piniaPersistIndexedDB);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Notify);
app.component("Footer", Footer);
app.mount("#app");

// CapacitorApp.addListener("backButton", () => {
//   console.log("backButton");

//   if (router.currentRoute.value.path === "/home") {
//     // 在首页，再点一次退出
//     CapacitorApp.exitApp();
//   } else {
//     router.back(); // 返回上一个路由页面
//   }
// });
