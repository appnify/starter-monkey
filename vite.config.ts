import { defineConfig } from "vite";
import monkey, { cdn, util } from "vite-plugin-monkey";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";

/**
 * vite 配置
 * @see https://cn.vitejs.dev/config/
 */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: "/src",
      },
    ],
  },
  plugins: [
    /**
     * 提供 Vue 3 单文件组件支持
     * @see https://cn.vitejs.dev/guide/features.html#vue
     */
    vue(),
    /**
     * 提供 Vue 3 JSX 支持
     * @see https://cn.vitejs.dev/guide/features.html#jsx
     */
    jsx(),
    /**
     * 油猴插件
     * @see https://github.com/lisonge/vite-plugin-monkey
     */
    monkey({
      entry: "src/main.ts",
      userscript: {
        icon: "https://vitejs.dev/logo.svg",
        namespace: "npm/vite-plugin-monkey",
        match: ["*://*/*"],
        require: [
          /**
           * 通过base64编码的方式引入外部脚本，设置Layui的路径，避免css文件找不到;
           * (function () { this.LAYUI_GLOBAL = {dir: 'https://cdn.jsdelivr.net/npm/layui@2.7.6/dist/'}; })()
           */
          `data:application/javascript;base64,OyhmdW5jdGlvbiAoKSB7IHRoaXMuTEFZVUlfR0xPQkFMID0ge2RpcjogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbGF5dWlAMi43LjYvZGlzdC8nfTsgfSkoKTsK`,
        ],
      },
      build: {
        externalGlobals: {
          vue: cdn.unpkg("Vue", "dist/vue.global.prod.js"),
          axios: cdn.unpkg("axios", "dist/axios.min.js"),
          jquery: cdn.unpkg("jQuery", "dist/jquery.min.js"),
          layui: cdn.unpkg("layui", "dist/layui.js"),
        },
        externalResource: {
          "layui/dist/css/layui.css": "https://cdn.jsdelivr.net/npm/layui@2.7.6/dist/css/layui.css",
        },
      },
    }),
  ],
});
