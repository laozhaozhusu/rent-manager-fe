import { App } from "@capacitor/app";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

export function useBackButtonHandler() {
  const router = useRouter();

  const backHandler = () => {
    console.log("backButton");
    console.log(router.currentRoute.value.name);
    if (router.currentRoute.value.name === "首页") {
      // 在首页，退出 App（再次按下返回键）
      App.exitApp();
    } else {
      // 否则返回上一页
      router.back();
    }
  };

  onMounted(() => {
    App.addListener("backButton", backHandler);
  });

  onUnmounted(() => {
    App.removeAllListeners(); // 避免重复监听
  });
}
