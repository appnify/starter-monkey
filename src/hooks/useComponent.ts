import { Component, createVNode, render } from "vue";

export const useComponent = (component: Component, props: any = {}) => {
  const el = document.createElement("span");
  const vnode = createVNode(component, props);
  render(vnode, el);
  console.log(vnode);
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
     * 卸载元素
     */
    remove: () => {
      render(null, el);
      el.remove();
    },
  };
};
