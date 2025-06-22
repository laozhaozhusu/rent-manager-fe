// vite.config.js
import { defineConfig, loadEnv } from "vite";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
import { resolve } from "path";
// import { VantResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue"; // 注意：需要安装 @vitejs/plugin-vue 插件

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      vue(),
      // AutoImport({
      //   resolvers: [VantResolver()],
      // }),
      // Components({
      //   resolvers: [VantResolver()],
      // }),
    ], // 使用Vue插件
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    build: {
      outDir: "dist", // 指定输出目录
      assetsDir: "assets", // 指定静态资源存放目录
      target: ["esnext"], // 指定编译目标
      cssCodeSplit: true, // 是否开启CSS代码分离
      sourcemap: mode === "dev", // 是否生成source map
      terserOptions: {
        compress: {
          drop_console: mode === "prod", // 生产环境移除console
          drop_debugger: mode === "prod", // 生产环境移除debugger
        },
      },
    },
    server: {
      port: 8080,
      open: mode === "dev", // 是否自动打开浏览器
    },
  };
});
