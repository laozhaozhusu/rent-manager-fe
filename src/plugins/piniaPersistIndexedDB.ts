import { PiniaPluginContext } from "pinia";
import localforage from "localforage";
import { toRaw } from "vue";
import clonedeep from "lodash.clonedeep";

export function piniaPersistIndexedDB({ store }: PiniaPluginContext) {
  localforage.config({
    name: "rent-manager-fe",
    storeName: "pinia_store", // 在 IndexedDB 中的 object store 名称
    driver: localforage.INDEXEDDB,
  });

  const key = `pinia-${store.$id}`;
  // 读取数据
  localforage.getItem(key).then((value) => {
    if (value) {
      try {
        store.$patch(value as object);
      } catch (error) {
        console.error(`${store.$id}状态无法从 IndexedDB 读取:`, error);
      }
      console.log("已注入 store 状态");
    } else {
      console.warn("⚠️ 没有找到持久化数据");
    }
  });

  // 订阅变化，保存到 IndexedDB
  store.$subscribe((_mutation, state) => {
    try {
      const rawState = toRaw(state);
      const cloned = clonedeep(rawState);
      localforage.setItem(key, cloned).catch((error) => {
        console.error(`${store.$id}写入到IndexedDB失败:`, error);
      });
    } catch (error) {
      console.error(`${store.$id}状态无法序列化到 IndexedDB:`, error);
    }
  });
}
