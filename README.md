自己写的油猴脚本

## 图标导出

在 IconFont 的项目中，导出符合 UnoCSS 自定义图标格式的 JSON 文件，该 JSON 对象的属性名为图标的 ID，属性值为对应的 SVG 文本。下载后的 JSON 文件应是如下格式：

```json
{
  "image": "<svg> 内容... </svg>",
  "video": "<svg> 内容... </svg>"
}
```

在 vite.config.ts 导入，作为参数传递给 prestIcon 插件，具体使用请查阅官方文档，示例如下：

```ts
import iconjson from './iconfont.json';

export default {
  plugins: [
    unocss({
      presetIcon({
        collections: {
          myprefix: iconjson
        }
      })
    })
  ]
}
```

然后在 src 目录中，就可以像 iconify 其他图标一样使用，示例如下：

```tsx
export const Button = () => {
  return (
    <button>
      <i class="i-myprefix-image" />
      测试按钮
    </button>
  );
};
```
