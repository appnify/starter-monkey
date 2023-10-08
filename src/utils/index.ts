/**
 * 等待一段时间
 * @param ms 等待的时间(ms)
 * @returns
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * document.querySelector的别名
 * @param selectors
 * @returns
 */
export const $ = document.querySelector;