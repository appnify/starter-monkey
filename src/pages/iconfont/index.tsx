import { useComponent } from "@/hooks";
import { sleep } from "@/utils";
import { download, json2DataUrl } from "@/utils/download";
import { definePage } from "@/utils/page";
import { Button, Form, FormItem, Message, Modal, Radio, RadioGroup } from "@arco-design/web-vue";
import {
  AllowedComponentProps,
  VNode,
  VNodeProps,
  computed,
  createVNode,
  defineComponent,
  ref,
  render,
  watch,
} from "vue";
import { AniDrawer } from "./drawer";

const AppButton = defineComponent({
  setup() {
    const modal = useModal(AppModal);
    const openModal = () =>
      modal.open({
        form: {
          type: "json",
        },
      });
    const d = useComponent(AniDrawer);
    document.body.appendChild(d);
    return () => (
      <Button type="primary" size="small" class="ml-2" onClick={openModal}>
        {{
          icon: () => <i class="i-icon-park-outline-download" />,
          default: () => "下载",
        }}
      </Button>
    );
  },
});

const AppModal = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const show = computed({
      get() {
        return props.visible;
      },
      set(v: boolean) {
        emit("update:visible", v);
      },
    });

    const getDetailJSON = async (pid: any) => {
      const url = `/api/project/detail.json?pid=${pid}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code !== 200) {
        throw new Error(data.message);
      }
      const result: Dict = {};
      for (let { show_svg, font_class } of data.data.icons) {
        show_svg = show_svg.replace("currentColor", "transparent");
        result[font_class] = show_svg;
      }
      return result;
    };

    const onConfirm = async () => {
      const pid = new URLSearchParams(location.search).get("projectId");
      try {
        const data = await getDetailJSON(pid);
        const dataurl = json2DataUrl(data);
        download(dataurl, "iconfont.json");
      } catch (e: any) {
        Message.error(e?.message);
      }
    };

    return () => (
      <Modal v-model:visible={show.value} title="下载图标" titleAlign="start" closable={false} onBeforeOk={onConfirm}>
        <Form model={props.form} layout="vertical">
          <FormItem label="文件类型" hideLabel>
            <RadioGroup v-model={props.form.type} direction="vertical">
              <Radio value="json">
                JSON格式
                <div class="text-xs text-gray-400">适用于 Unocss PresetIcons 插件的自定义图标格式</div>
              </Radio>
              <Radio value="zip" class="mt-[16px]">
                ZIP压缩包
                <div class="text-xs text-gray-400">适用于 Svg 用作单组件的场景</div>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  },
});

const useDrawer = (component: any, options: any = {}) => {
  const { firstChild = false } = options;

  let el: HTMLDivElement;
  let vn: VNode;
  let instance = ref<any>();

  const _mount = () => {
    vn = createVNode(_modal);
    el = document.createElement("div");
    render(vn, el);
    const child = firstChild ? el.firstElementChild! : el;
    document.body.appendChild(child);
  };

  const _unmount = () => {
    render(null, el);
    el?.remove?.();
  };

  const _modal = defineComponent({
    setup() {
      return () => <component ref={(el: any) => (instance.value = el)} onDone={_unmount}></component>;
    },
  });

  const open = () => {
    _mount();
    instance.value?.open?.();
  };

  return { open };
};

const useModal = <T extends abstract new (...args: any) => any>(
  component: T,
  options: {
    trigger?: boolean;
  } = {}
) => {
  type Props = InstanceType<T>["$props"];
  type PickChildProps = {
    -readonly [K in keyof Omit<Props, keyof VNodeProps | keyof AllowedComponentProps>]: Props[K];
  };
  type Options = Omit<PickChildProps, "visible" | "onUpdate:visible">;

  let _el: HTMLDivElement;
  let _vn: VNode;

  const instance = ref<InstanceType<T>>();
  const visible = ref(true);
  const props = ref({});

  watch(
    () => visible.value,
    (v) => !v && close()
  );

  const _mount = () => {
    _vn = createVNode(_modal);
    _el = document.createElement("div");
    render(_vn, _el);
    document.body.appendChild(_el);
  };

  const _unmount = () => {
    render(null, _el);
    _el?.remove?.();
  };

  const _modal = defineComponent({
    setup() {
      console.log(props.value);
      return () => (
        <component
          {...props.value}
          ref={(el: any) => (instance.value = el)}
          v-model:visible={visible.value}
        ></component>
      );
    },
  });

  /**
   * 打开弹窗
   */
  const open = (options?: Options) => {
    _mount();
    props.value = options || {};
    visible.value = true;
  };

  /**
   * 关闭弹窗
   */
  const close = () => {
    _unmount();
  };

  return {
    instance,
    open,
    close,
  };
};

export default definePage({
  when: (url: string) => {
    const target = new URL(url);
    const isHost = target.hostname === "www.iconfont.cn";
    const params = new URLSearchParams(target.search);
    const isType = params.get("manage_type") === "myprojects";
    return isHost;
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
