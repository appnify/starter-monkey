import { render, createVNode, RenderFunction } from "vue";

const getDetailJSON = async (pid: any) => {
  const url = `/api/project/detail.json?pid=${pid}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data;
};

export const Button = () => {
  const onClick = async () => {
    const pid = new URLSearchParams(location.search).get("projectId");
    const data = await getDetailJSON(pid);
    console.log(data);
  };
  return <button onClick={onClick}>测试按钮</button>;
};

export const useNode = (component: RenderFunction, props: any = {}) => {
  const box = document.createElement("span");
  const vnode = createVNode(component, props);
  render(vnode, box);
  return box;
};
