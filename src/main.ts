import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import { createPinia } from "pinia";
import { piniaPersistIndexedDB } from "./plugins/piniaPersistIndexedDB";
import "vant/lib/index.css";

const pinia = createPinia();
pinia.use(piniaPersistIndexedDB);

const app = createApp(App);
app.use(router);
app.use(pinia);
// app.use(Dialog);
// app.use(List);
// app.use(Cell);
// app.use(SwipeCell);
// app.use(Button);
app.mount("#app");
