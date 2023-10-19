/**
 * 页面接口
 */
export interface Page {
  when: () => boolean;
  work: () => void;
}

/**
 * 定义页面脚本
 * @param page 页面配置
 * @returns 
 */
export const definePage = (page: Page) => {
  return page;
}