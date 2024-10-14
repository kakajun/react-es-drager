import { App } from 'vue'
import Rect from './basic/Rect.tsx'
import Group from './editor/Group.tsx/index.js'
import ElIconWrapper from './icon/icon.tsx/index.js'
import Area from './editor/Area.tsx/index.js'
import GridRect from './editor/GridRect.tsx/index.js'
import MarkLine from './editor/MarkLine.tsx/index.js'
import TextEditor from './editor/TextEditor.tsx/index.js'
import Chart from './basic/chart/Chart.tsx'
export {
  Group,
  Area,
  GridRect,
  MarkLine,
  TextEditor
}
export default {
  install: (app: App) => {
    app.component('es-chart', Chart)
    app.component('v-rect', Rect)
    app.component('es-icon', ElIconWrapper)
    app.component('es-group', Group)
  }
}
