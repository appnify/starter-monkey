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

/**
 * 下载JSON为文件
 * @param json JSON对象
 * @param filename 下载文件名
 */
export const downloadJSON = (json: any, filename = "data.json") => {
  const url = json2DataUrl(json);
  download(url, filename);
};
