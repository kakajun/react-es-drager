import { ComponentPropsWithRef } from 'react'

export type IDotSide =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
export type EventType =
  | 'change'
  | 'drag'
  | 'drag-start'
  | 'drag-end'
  | 'resize'
  | 'resize-start'
  | 'resize-end'
  | 'rotate'
  | 'rotate-start'
  | 'rotate-end'
export type IDot = {
  side: IDotSide
  cursor?: string
}

export interface MarklineData {
  top?: null | number
  left?: null | number
  diffX?: number
  diffY?: number
}

export interface DragerProps extends ComponentPropsWithRef<'div'> {
  tag?: React.ComponentType<any> | string
  resizable?: boolean
  rotatable?: boolean
  boundary?: boolean
  disabled?: boolean
  width?: number
  height?: number
  left?: number
  top?: number
  zIndex?: number
  angle?: number
  color?: string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  aspectRatio?: number
  selected?: boolean
  snapToGrid?: boolean
  gridX?: number
  gridY?: number
  scaleRatio?: number
  disabledKeyEvent?: boolean
  border?: boolean
  resizeList?: IDotSide[]
  equalProportion?: boolean
  checkCollision?: boolean
  snap?: boolean
  snapThreshold?: number
  markline?: boolean | ((data: MarklineData) => void)
  children: React.ReactNode
}

export interface DragData {
  width: number
  height: number
  left: number
  top: number
  angle: number
}
