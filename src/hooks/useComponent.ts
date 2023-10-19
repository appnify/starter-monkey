import { Component, VNode, createVNode, render } from "vue";

interface ComponentContext {
  /**
   * 挂载元素
   */
  el: HTMLElement;
  /**
   * 渲染元素
   */
  node: HTMLElement;
  /**
   * 虚拟节点
   */
  vnode: VNode;
  /**
   * 挂载组件
   */
  unmount: () => void;
  /**
   * 卸载元素
   */
  remove: () => void;
}

export const useComponent = (component: Component, props: any = {}) => {
  const el = document.createElement("span");
  const vnode = createVNode(component, props);
  render(vnode, el);
  const node = vnode.el as HTMLElement;
  const unmount = () => render(null, el);
  const remove = () => (unmount(), el.remove());
  console.log(vnode);

  return { el, node, vnode, unmount, remove } as ComponentContext;
};
