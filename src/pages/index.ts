import { Page } from "@/utils/page";

const files = import.meta.glob("./*/index.tsx", { eager: true, import: "default" });

/**
 * 运行页面
 * @description 通过匹配页面地址，运行对应的脚本
 */
export const run = async () => {
  const pages: Page[] = Object.values(files as any);
  for (const page of pages) {
    if (page.when(location.href)) {
      page.work();
    }
  }
};
