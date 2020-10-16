# create-oss-app

Creates a B2-OSS application using the command line.

### 初始化 App
你可以通过以下命令来快速创建一个 App 的模版：

```bash
npm init oss-app [--js]
```
或
```bash
yarn create oss-app [--js]
```

> 如果需要使用 JavaScript 而非 TypeScript 可增加 `--js` 选项

初始化过程需要输入 App id 等信息，最终产生目录结构如下（如 App id 为 `demo`）：

```
- /demo                 // 目录名以 App id 命名
  - assets              // 资源目录，存放如图片、CSS 等
    - icon.svg          // App 图标
    - demo.scss         // App scss 样式表
  - components
    - statusbar.tsx     // 底部状态栏组件
  - service
    - demo.ts           // App egg 服务脚本
  - demo.ts             // App 描述文件
  - store.ts            // Mobx 应用数据
  - index.tsx           // 首页
  - pageage.json        // package 依赖等信息
```

其中 App 描述文件（demo.ts）内容大致如下：

```js
import Icon from './assets/icon.svg';

export default ({
  title: 'Demo App',
  icon: Icon,
});
```

以下是描述项目的接口类：
```ts
interface IAppConfig {
  title: string;              // 应用名称
  icon: any;                  // 应用图标
  menu?: Array<IMenuItem>;    // 菜单
  statusbar?: any;            // 窗口底部状态栏
  widgets?: Array<IWidget>;   // Widgets
  store?: any;                // 应用内 store
  mainWindow?: {              // 主窗口配置
    fixed?: boolean;          // 主窗口是否固定大小
    minimumWidth?: number;    // 主窗口最小宽度
    minimumHeight?: number;   // 主窗口最小高度
    maximumWidth?: number;    // 主窗口最大宽度
    maximumHeight?: number;   // 主窗口最大宽度
  };
}
```

App 的依赖可以添加到 `package.json` 中，在 `app add` 过程中会自动安装

`/service` 目录会作为服务脚本自动注册到 `egg` 服务器中，除该目录外，App 中的其它文件都遵循 [UMI 的约定式路由](https://umijs.org/zh-CN/docs/convention-routing) 自动注册。

### 调试 App

> TODO
