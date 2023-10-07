import { Component, createVNode, render } from "vue";

export const useComponent = (component: Component, props: any = {}) => {
  const box = document.createElement("span");
  const vnode = createVNode(component, props);
  render(vnode, box);
  return box;
};
