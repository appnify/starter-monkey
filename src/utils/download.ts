/**
 * 下载文件
 * @param url 文件地址
 * @param filename 文件名
 * @returns
 */
export const download = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
};

/**
 * JSON转DATA URL
 * @param json JSON对象
 */
export const json2DataUrl = (json: any) => {
  const content = encodeURIComponent(JSON.stringify(json));
  return `data:text/json;charset=utf-8,${content}`;
};