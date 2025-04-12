import { defineConfig } from "vite";
import path from "node:path";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import uni from "@dcloudio/vite-plugin-uni";
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import ViteRestart from 'vite-plugin-restart'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: tailwindcss } = await import("@tailwindcss/vite");
  return {
    plugins: [
      UniPages(),
      UniLayouts(),
      tailwindcss(),
      UnifiedViteWeappTailwindcssPlugin({
        rem2rpx: true,
      }),
      uni(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.ts']
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // server: {
    //   host: "0.0.0.0",
    //   proxy: {
    //     "/api": {
    //       // target: "http://127.0.0.1:8000",
    //       target: 'http://14.103.153.217/api',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //   },
    // },
  };
});
