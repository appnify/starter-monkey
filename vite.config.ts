import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import monkey, { cdn, util } from "vite-plugin-monkey";
import unocss from "unocss/vite";
import { presetUno, presetIcons } from "unocss";

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
     * Unocss 插件
     * @see https://unocss.dev/integrations/vite
     */
    unocss({
      presets: [
        presetUno(),
        presetIcons({
          extraProperties: {
            display: "inline-block",
            "vertical-align": "-2px",
          },
        }),
      ],
    }),
    /**
     * 油猴插件
     * @see https://github.com/lisonge/vite-plugin-monkey
     */
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "Appnify",
        description: "A vite based tampermonkey starter",
        icon: "https://vitejs.dev/logo.svg",
        namespace: "appnify",
        match: ["*://*/*"],
      },
      build: {
        externalGlobals: {
          vue: cdn.unpkg("Vue", "dist/vue.global.prod.js").concat(
            await util.fn2dataUrl(() => {
              // @ts-ignore
              window.Vue = Vue;
            })
          ),
          "@arco-design/web-vue": cdn.unpkg("ArcoVue", "dist/arco-vue.min.js"),
        },
        externalResource: {
          "@arco-design/web-vue/dist/arco.css": "https://unpkg.com/@arco-design/web-vue@2.52.0/dist/arco.css",
        },
      },
    }),
  ],
});
