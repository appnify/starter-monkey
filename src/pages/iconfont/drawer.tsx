import { download, json2DataUrl } from "@/utils/download";
import { Badge, Button, Drawer, InputSearch, Link, Message, Modal, Table, TableColumnData } from "@arco-design/web-vue";
import { defineComponent, nextTick, onMounted, ref } from "vue";

interface IconItem {
  id: number;
  name: string;
  svg: string;
}

const confirm = () => {
  return new Promise<void>((res, rej) => {
    Modal.confirm({
      title: "提示",
      content: "确定删除当前选中数据吗",
      onOk: () => res(),
      onCancel: () => rej(),
      onClose: () => rej(),
    });
  });
};

export const AniDrawer = defineComponent({
  setup() {
    const visible = ref(false);
    const open = () => {
      data.value = database.value;
      visible.value = true;
    };

    const database = ref<IconItem[]>([]);
    const data = ref<IconItem[]>([]);
    const addItem = (item: IconItem) => {
      const ids = database.value.map((i) => i.id);
      item.id = ids.length ? Math.max.apply(null, ids) + 1 : 1;
      database.value.push(item);
      localStorage.setItem("ANI_DATA", JSON.stringify(database.value));
    };
    const delItem = (item: IconItem) => {
      const index = database.value.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        database.value.splice(index, 1);
        localStorage.setItem("ANI_DATA", JSON.stringify(database.value));
      }
    };
    const onExportData = () => {
      const dataurl = json2DataUrl(database.value);
      download(dataurl, "iconfont.json");
    };

    const search = ref({ name: "" });
    const onSearch = () => {
      data.value = database.value.filter((item) => item.name.includes(search.value.name));
    };

    const columns: TableColumnData[] = [
      {
        title: "内容",
        dataIndex: "svg",
        render: ({ record }) => {
          const copy = () => {
            navigator.clipboard.writeText(record.svg);
            Message.success(`已复制 ${record.name} 的SVG内容`);
          };
          const del = async () => {
            await confirm();
            delItem(record as any);
            Message.success(`已删除 ${record.name}`);
            onSearch();
          };
          return (
            <div class="group flex items-center justify-between gap-4">
              <div>
                <span innerHTML={record.svg} class="mr-2 w-4 h-4"></span>
                {record.name}
                <span
                  class="hidden group-hover:inline-block cursor-pointer ml-2 text-gray-400 hover:text-gray-700"
                  onClick={copy}
                >
                  <i class="i-icon-park-outline-copy" />
                </span>
              </div>
              <div class="space-x-1">
                <Link onClick={copy}>复制</Link>
                <Link onClick={del}>删除</Link>
              </div>
            </div>
          );
        },
      },
    ];

    onMounted(async () => {
      await nextTick();
      const str = localStorage.getItem("ANI_DATA");
      if (str) {
        database.value = JSON.parse(str);
      }
      const ul = document.querySelector(".collection-detail .block-icon-list");
      if (!ul) {
        return console.log("ul not found");
      }
      for (const li of Array.from(ul.children)) {
        const btn = document.createElement("button");
        btn.innerText = "添加";
        btn.style.position = "relative";
        btn.style.top = "20px";
        btn.addEventListener("click", function () {
          const svg = this.parentElement?.querySelector(".icon-twrap")?.innerHTML ?? "";
          const name = this.parentElement?.querySelector(".icon-name")?.textContent ?? "";
          const exist = data.value.find((item: any) => item.svg === svg);
          if (exist) {
            return Message.warning("该图标已添加过");
          }
          addItem({ id: 0, svg, name });
          Message.success("添加成功");
          (this.innerText = "已添加"), (this.disabled = true);
        });
        li.appendChild(btn);
      }
    });

    const selected = ref<number[]>([]);
    const onSelectionChange = (keys: (string | number)[]) => {
      selected.value = keys.map(Number);
    };
    const onDeleteSelected = async () => {
      await confirm();
      database.value = database.value.filter((i) => !selected.value.includes(i.id));
      localStorage.setItem("ANI_DATA", JSON.stringify(database.value));
      Message.success("删除成功");
      onSearch();
    };

    return () => (
      <>
        <Badge count={database.value.length} class="fixed right-8 top-[50%]">
          <Button onClick={open} type="primary">
            打开
          </Button>
        </Badge>
        <Drawer title="图标管理" v-model:visible={visible.value} width={900} closable={false}>
          {{
            default: () => (
              <div>
                <div class="flex justify-between gap-4">
                  <div class="space-x-2">
                    <Button size="small" type="primary" onClick={onExportData}>
                      导出全部
                    </Button>
                    <Button size="small" status="danger" disabled={!selected.value.length} onClick={onDeleteSelected}>
                      批量删除
                    </Button>
                  </div>
                  <div>
                    <InputSearch v-model={search.value.name} onSearch={onSearch}></InputSearch>
                  </div>
                </div>
                <div class="mt-4">
                  <Table
                    columns={columns}
                    data={data.value}
                    bordered={true}
                    pagination={{
                      showTotal: true,
                      showPageSize: true,
                    }}
                    rowSelection={{
                      showCheckedAll: true,
                    }}
                    rowKey="id"
                    onSelectionChange={onSelectionChange}
                  ></Table>
                </div>
              </div>
            ),
          }}
        </Drawer>
      </>
    );
  },
});
