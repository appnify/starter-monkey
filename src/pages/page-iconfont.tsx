import { useComponent } from "@/hooks";
import { sleep } from "@/utils";
import { downloadJSON } from "@/utils/download";
import { definePage } from "@/utils/page";
import { Button, Message } from "@arco-design/web-vue";
import { defineComponent, ref } from "vue";

/**
 * 下载图标
 * @description 下载Iconfont项目的图标为JSON文件
 */
export default definePage({
  when: () => {
    const isHost = location.hostname === "www.iconfont.cn";
    const params = new URLSearchParams(location.search);
    const isType = params.get("manage_type") === "myprojects";
    return isHost && isType;
  },
  work: async () => {
    await sleep(2000);
    const box = document.querySelector(".project-iconlist");
    const btn = useComponent(DownloadButton);
    if (box) {
      box.prepend(btn.node);
    }
  },
});

export const DownloadButton = defineComponent({
  name: "DownloadButton",
  setup() {
    const loading = ref(false);
    const btnRef = ref<HTMLButtonElement | null>(null);
    const onBtnRef = (el: any) => (btnRef.value = el);

    const getDetailJSON = async () => {
      const pid = new URLSearchParams(location.search).get("projectId");
      const url = `/api/project/detail.json?pid=${pid}`;
      const resData = await (await fetch(url)).json();
      if (resData.code !== 200) {
        throw new Error(resData.message);
      }
      const result: Dict = {};
      for (let { show_svg, font_class } of resData.data.icons) {
        show_svg = show_svg.replace("currentColor", "transparent");
        result[font_class] = show_svg;
      }
      return result;
    };

    const onConfirm = async () => {
      console.log(btnRef);
      try {
        loading.value = true;
        const data = await getDetailJSON();
        downloadJSON(data);
      } catch (e: any) {
        Message.error(e?.message);
      } finally {
        loading.value = false;
      }
    };

    return () => (
      <Button ref={onBtnRef} type="primary" size="small" class="ml-2" loading={loading.value} onClick={onConfirm}>
        {{
          icon: () => <i class="i-icon-park-outline-download" />,
          default: () => "下载",
        }}
      </Button>
    );
  },
});
