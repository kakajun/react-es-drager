import { DragerProps } from 'react-es-drager'

export type ComponentType = DragerProps & {
  id?: string
  component?: string
  text?: string
  group?: boolean
  groupStyle?: React.CSSProperties
  props?: any
  style?: React.CSSProperties
  editable?: boolean
}

export type EditorDataType = {
  container: {
    snapToGrid: boolean
    markline: {
      color?: string
      show?: boolean
    }
    gridSize: number
    gridColor?: string
    style: React.CSSProperties
    scaleRatio?: number
  }
  elements: ComponentType[]
}

export type IconType = DragerProps & {
  component?: string
  text?: string
  style?: React.CSSProperties
  props?: any
  icon?: string
}

export type ToolType = {
  label: string
  icon?: any
  handler: () => void // 在React中通常会传递一个无返回值的函数
}

export interface EditorState {
  data: EditorDataType
  current: ComponentType
  preview: boolean
}
