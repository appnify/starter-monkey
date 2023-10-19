import { Component, createVNode, render } from "vue";

export const useComponent = (component: Component, props: any = {}) => {
  const el = document.createElement("div");
  el.className = "appnify-modal-container";
  const vnode = createVNode(component, props);
  render(vnode, el);
  document.appendChild(el);
  return {
    /**
     * 挂载元素
     */
    el: el,
    /**
     * 渲染元素
     */
    node: vnode.el as HTMLElement,
    /**
     * 虚拟节点
     */
    vnode: vnode,
    /**
     * 挂载组件
     */
    unmount: () => {
      render(null, el);
    },
    /**
     * 打开弹窗
     */
    opean() {

    }
  };
};
