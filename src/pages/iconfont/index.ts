import $ from "jquery";
import layui from "layui";
import 'layui/dist/css/layui.css';
import { Button, useNode } from "@/components/one";

console.log(`加载：${$.name}, ${layui.v}`);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const run = async () => {
  if(/iconfont.cn/.test(location.href)) {
    await sleep(3000);
    const box = $('.project-manage-bar:not(.hide)');
    const last = box.find('.bar-text.btn.btn-normal').last();
    const bt1 = useNode(Button);
    last.after(bt1);
  }
};