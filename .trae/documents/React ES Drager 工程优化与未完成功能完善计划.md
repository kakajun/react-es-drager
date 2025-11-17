## 总览
- 修复当前构建错误并清理不规范的 React 用法（Hooks、Portal、动态组件）。
- 完成公共能力（右键菜单、上传、导入/导出对话框、预览）闭环实现。
- 统一类型与动态渲染方式，提升可维护性与可测试性。
- 优化状态管理与交互事件，减少不必要的重渲染与潜在副作用。
- 验证与文档示例联动，保证可运行的演示与开发体验。

## 构建错误修复
1. 修复 JSX 解析错误：`packages/editor/src/components/common/contextmenu/index.ts:39` 使用了 JSX，但文件扩展名为 `.ts`。
   - 重命名为 `.tsx`，并移除在普通函数中使用 React Hooks 的不规范写法。
   - 正确使用 React 18 `createRoot`，类型改为 `Root`（`react-dom/client`）。
   - 参考：`packages/editor/src/components/common/contextmenu/index.ts:39`。
2. 动态组件用法纠正：`<component is={...}>` 为 Vue 语法，需替换为 React 变量组件。
   - 编辑器：将 `packages/editor/src/components/editor/index.tsx` 中渲染改为 `const Comp = item.component; <Comp ...>`。
   - 图标：将 `packages/editor/src/components/icon/icon.tsx` 中 `<component is={icon} />` 改为 `const Icon = icon; <Icon />`。

## 公共能力完善（未完成/不规范）
1. 右键菜单 `$contextmenu`
   - 去除顶层 Hooks；实现单例 Root + 容器复用；支持 render/update；在 `Menu.tsx` 内保留点击外部关闭逻辑。
   - 统一 `MenuItem`、`MenuOption` 类型在 `contextmenu` 模块导出，`Menu.tsx` 直接复用。
2. 上传 `$upload`
   - 现有实现在普通函数中使用 Hooks，并混用 React 18/17 API（`ReactDOM.render` 未引入）。
   - 改为 React 18 `createRoot` Portal 服务：创建一次 Root，渲染 `<Upload option={...} />`，后续仅更新 props。
   - 类型与行为与 `Upload.tsx` 兼容（支持 `json/text/image` 结果）。
3. 导入/导出对话框 `$dialog` 与 `Dialog.tsx`
   - 服务：同 `$contextmenu` 方式实现 Portal 服务函数，不使用 Hooks。
   - 组件：移除 Ace（未安装依赖），用 `<textarea>` 简化；提供 JSON 校验、保存回调与导出文件功能。
   - 修正不合法 JSX（`<template slot="footer">`）为 Modal `footer` 属性；移除 `draggable` 非标准属性。
4. 预览 `Preview.tsx`
   - 统一动态组件类型（字符串标签或组件均可）；按钮改为标准 `<button>` 或接入 antd（保持轻量）。
   - 确保样式类存在或降级为内联样式，保证开箱可用。

## 类型一致性与可维护性
- 将动态组件类型统一为 `keyof JSX.IntrinsicElements | React.ComponentType<any>`，避免 `string`/`ComponentType` 混用造成的类型不一致。
- 在 `Menu.tsx` 直接使用从 `contextmenu` 导出的类型，移除重复定义。
- 在 `Preview.tsx` 的 `ElementProps.component` 放宽为上述联合类型。

## 状态管理与交互优化
- Zustand 使用规范：避免深度直接 mutate（如 `EditorStyle.tsx`、属性面板），改为 `store.update({...})` 或专用 setter，确保订阅更新。
- 键盘事件：将 `window.addEventListener('keydown')` 改为作用于编辑器容器（或使用 `useEffect` + 清理）并使用 `useRef` 持久回调，减少重复注册与闭包漂移。
- `editor/index.tsx` 中大量匿名函数事件，提取为 `useCallback` 并稳定依赖，减少重渲染与避免不必要的阻塞。

## 文档与示例联动
- 打通 `Menu` 示例路由（当前被注释），在保证实现完备后开放到 Docs。
- `Home.tsx` 的 `import.meta.glob` 保持仅用于源码展示，不参与构建，示例页面通过路由引入。

## 验证与质量保障
- 启动文档站 Dev，确保无构建错误；右键菜单、上传、导入/导出、预览均可交互。
- 针对核心能力添加最小化回归测试（类型层面 + 单元级 util：`makeGroup/cancelGroup`、`calcLines`）。
- 手动验证：
  - 组合/拆分在旋转状态下位置计算是否正确。
  - 锁定元素后菜单项受限行为是否生效。
  - 上传图片与 JSON 导入后数据正确落盘。

## 实施步骤
1. 修复构建：重命名 `contextmenu/index.tsx` 并改为无 Hooks 服务；统一类型。
2. 修复编辑器/图标动态组件渲染。
3. 重写 `$upload` 与 `$dialog` 服务；替换 `Dialog.tsx` 为可运行版本。
4. 优化预览组件类型与导出逻辑。
5. 状态更新改为 setter；梳理键盘与鼠标交互并稳定回调。
6. 打通 `Menu` 示例路由并进行端到端验证。
7. 补充最小化测试与开发指南（仅在仓内注释，避免创建文档文件）。

## 交付标准
- Dev 环境无报错；右键菜单、上传、导入/导出、预览功能闭环。
- 组合/拆分、锁定、层级移动、选择全选等操作在菜单与快捷键下均稳定。
- 类型与 API 一致，后续迭代可扩展。

确认后我将开始逐项实施、提交修改并验证运行效果。