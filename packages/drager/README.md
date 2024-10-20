# Rect ES Drager 拖拽组件

- [中文](https://github.com/kakajun/react-es-drager)
- [English](https://github.com/kakajun/react-es-drager/blob/main/README_en.md)

<p align="middle" ><img width="100" src="https://kakajun.github.io/react-es-drager/logo/logo.png"/></p>

<table width="100%" align="center">
<tr>
<th colspan="4">ES Drager</th>
</tr>
<tr>
<td align="center"><a href="https://kakajun.github.io/react-es-drager/"><strong>Draggable</strong></a></td>
<td align="center"><a href="https://kakajun.github.io/react-es-drager/"><strong>Resizable</strong></a></td>
<td align="center"><a href="https://kakajun.github.io/react-es-drager/"><strong>Rotatable</strong></a></td>
</tr>
<tr>
<td align="center">
<img src="https://kakajun.github.io/react-es-drager//static/draggable.gif" />
</td>
<td align="center">
<img src="https://kakajun.github.io/react-es-drager//static/resizable.gif" />
</td>
<td align="center">
<img src="https://kakajun.github.io/react-es-drager//static/rotatable.gif" />
</td>
</tr>
</table>

## 🌈介绍

基于 react18 + typescript + vite 的可拖拽、缩放、旋转的组件

- 拖拽&区域拖拽
- 支持缩放
- 旋转
- 网格拖拽缩放
- 拖拽编辑器

### 运行项目

```sh
# 拉取项目
git clone https://github.com/kakajun/react-es-drager.git

# 安装依赖
pnpm install

# 运行项目
pnpm dev

# 打包drager组件
pnpm build

# 打包文档
pnpm build:demo
```

### 主要目录介绍

| 目录            | 功能说明                 |
| --------------- | ------------------------ |
| packages/docs   | 项目示例文档、编辑器展示 |
| packages/editor | 编辑器核心代码           |
| packages/drager | es-drager组件            |

## 综合案例

下面是基于 `react-es-drager` 实现的一个简单可视化拖拽编辑器

[ES Drager Editor](https://kakajun.github.io/react-es-drager//#/editor)

### 相关文章

[可拖拽、缩放、旋转组件实现细节](https://juejin.cn/post/7225152932675993655)

[网格效果及使用方法](https://juejin.cn/post/7239895206081806373)

[辅助线和撤销回退](https://juejin.cn/post/7254812719349383225)

[元素组合与拆分](https://juejin.cn/post/7258337246024843319)

[菜单操作栏、json数据导入导出](https://juejin.cn/post/7269603447673880636)

## ⚡ 使用说明

### 安装依赖

```
npm i react-es-drager -D
```

### 组件中直接使用

```jsx
import Drager from 'react-es-drager'
const dragList = []
const BasicComponent = () => {
  return (
    <>
      {dragList.map((list, index) =>
        list.map((item, index2) => (
          <Drager
            key={`${index}-${index2}`}
            width={100}
            height={100}
            left={index2 * 150 + 30}
            top={index * 150 + 30}
            {...item}
            style={{ color: item.color }}
          >
            {item.text}
          </Drager>
        ))
      )}
    </>
  )
}

export default BasicComponent
```

## Drager API

### Drager 属性

| 属性名 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| width | 宽度 | ^[number] | 100 |
| height | 高度 | ^[number] | 100 |
| left | 横坐标偏移 | ^[number] | 0 |
| top | 纵坐标偏移 | ^[number] | 0 |
| angle | 旋转角度 | ^[number] | 0 |
| color | 颜色 | ^[string] | #3a7afe |
| resizable | 是否可缩放 | ^[boolean] | true |
| rotatable | 是否可旋转 | ^[boolean] | - |
| boundary | 是否判断边界(最近定位父节点) | ^[boolean] | - |
| disabled | 是否禁用 | ^[boolean] | - |
| minWidth | 最小宽度 | ^[number] | 1 |
| minHeight | 最小高度 | ^[number] | 1 |
| maxWidth | 最大宽度 | ^[number] | 9999 |
| maxHeight | 最大高度 | ^[number] | 9999 |
| selected | 控制是否选中 | ^[boolean] | - |
| checkCollision | 是否开启碰撞检测 | ^[boolean] | - |
| snapToGrid | 开启网格 | ^[boolean] | - |
| gridX | 网格X大小 | ^[number] | 50 |
| gridY | 网格Y大小 | ^[number] | 50 |
| snap | 开启吸附 | ^[boolean] | - |
| snapThreshold | 吸附阈值 | ^[number] | 10 |
| markline | 辅助线([可自定义] | ^[boolean]^[Function] | - |
| scaleRatio | 缩放比 | ^[number] | 1 |
| disabledKeyEvent | 禁用方向键移动 | ^[boolean] | - |
| border | 是否显示边框 | ^[boolean] | true |
| aspectRatio | 宽高缩放比 | ^[number] | - |
| equalProportion | 宽高等比缩放(该属性和aspectRatio互斥，同时使用会存在问题) | ^[boolean] | - |
| resizeList | 显示的缩放handle列表，`top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right` | ^[string[]] | - |

### Drager 事件

| 事件名        | 说明            | 类型                            |
| ------------- | --------------- | ------------------------------- |
| onChange      | 位置、大小改变  | ^[Function]`(dragData) => void` |
| onDrag        | 拖拽中          | ^[Function]`(dragData) => void` |
| onDragStart   | 拖拽开始        | ^[Function]`(dragData) => void` |
| onDragEnd     | 拖拽结束        | ^[Function]`(dragData) => void` |
| onResize      | 缩放中          | ^[Function]`(dragData) => void` |
| onResizeStart | 缩放开始        | ^[Function]`(dragData) => void` |
| onResizeEnd   | 缩放结束        | ^[Function]`(dragData) => void` |
| onRotate      | 旋转中          | ^[Function]`(dragData) => void` |
| onRotateStart | 旋转开始        | ^[Function]`(dragData) => void` |
| onRotateEnd   | 旋转结束        | ^[Function]`(dragData) => void` |
| onFocus       | 获取焦点/选中   | ^[Function]`(selected) => void` |
| onBlur        | 失去焦点/非选中 | ^[Function]`(selected) => void` |

- dragData 类型

```javascript
export type DragData = {
  width: number
  height: number
  left: number
  top: number
  angle: number
}
```

### Drager 插槽

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |
| resize  | 缩放handle     |
| rotate  | 旋转handle     |
