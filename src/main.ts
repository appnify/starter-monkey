import { pages } from "@/pages";
import "@/styles/index.css";
import "@arco-design/web-vue/dist/arco.css";
import "virtual:uno.css";

/**
 * 运行脚本
 * @description 通过匹配页面地址，运行对应的脚本
 */
const run = () => {
  for (const page of pages) {
    if (page.when()) {
      page.work();
    }
  }
};

run();
