import { useComponent } from "@/hooks";
import { sleep } from "@/utils";
import { download, json2DataUrl } from "@/utils/download";
import { definePage } from "@/utils/page";
import { Button, Message } from "@arco-design/web-vue";
import { IconDownload } from "@arco-design/web-vue/es/icon";
import { defineComponent, ref } from "vue";

/**
 * 获取项目的图标详情
 * @param pid 项目ID
 * @returns
 */
const getDetailJSON = async (pid: any) => {
  const url = `/api/project/detail.json?pid=${pid}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 200) {
    Message.error(data.message);
    throw new Error(data);
  }
  const result: Dict = {};
  for (let { show_svg, font_class } of data.data.icons) {
    show_svg = show_svg.replace("currentColor", "transparent");
    result[font_class] = show_svg;
  }
  return result;
};

const AppButton = defineComponent({
  setup() {
    const loading = ref(false);
    const onClick = async () => {
      const pid = new URLSearchParams(location.search).get("projectId");
      try {
        loading.value = true;
        const data = await getDetailJSON(pid);
        const dataurl = json2DataUrl(data);
        download(dataurl, "iconfont.json");
      } finally {
        loading.value = false;
      }
    };
    return () => (
      <Button type="primary" size="small" loading={loading.value} onClick={onClick}>
        {{
          icon: () => <IconDownload />,
          default: () => (loading.value ? "下载中..." : "下载"),
        }}
      </Button>
    );
  },
});

export default definePage({
  when: (url: string) => {
    const target = new URL(url);
    const isHost = target.hostname === "www.iconfont.cn";
    const params = new URLSearchParams(target.search);
    const isType = params.get("manage_type") === "myprojects";
    return isHost && isType;
  },
  work: async () => {
    await sleep(3000);
    const box = document.querySelector(".project-iconlist");
    const btn = useComponent(AppButton);
    if (box) {
      box.prepend(btn);
    }
  },
});
