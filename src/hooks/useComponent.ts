import { render, createVNode, RenderFunction } from "vue";

export const useComponent = (component: RenderFunction, props: any = {}) => {
  const box = document.createElement("span");
  const vnode = createVNode(component, props);
  render(vnode, box);
  return box;
};
