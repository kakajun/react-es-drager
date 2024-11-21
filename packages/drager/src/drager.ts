export type IDotSide =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export type IDot = {
  side: IDotSide
  cursor?: string
}

export type TriggerEvent =
  | 'drag'
  | 'dragStart'
  | 'dragEnd'
  | 'resize'
  | 'resizeStart'
  | 'resizeEnd'
  | 'rotate'
  | 'rotateStart'
  | 'rotateEnd'

export interface MarklineData {
  top?: null | number
  left?: null | number
  diffX?: number
  diffY?: number
}

export interface DragerProps {
  size?: {
    width: number
    height: number
    left: number
    top: number
    angle: number
  }
  defaultSize?: {
    width: number
    height: number
    left: number
    top: number
    angle: number
  }
  resizable?: boolean
  rotatable?: boolean
  boundary?: boolean
  disabled?: boolean
  zIndex?: number
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
  onChange?: (data: DragData) => void
  onDrag?: (data: DragData) => void
  onDragStart?: (data: DragData) => void
  onDragEnd?: (data: DragData) => void
  onResize?: (data: DragData) => void
  onResizeStart?: (data: DragData) => void
  onResizeEnd?: (data: DragData) => void
  onRotate?: (data: DragData) => void
  onRotateStart?: (data: DragData) => void
  onRotateEnd?: (data: DragData) => void
  onFocus?: (selected: boolean) => void
  onBlur?: (selected: boolean) => void
}

export interface DragData {
  width: number
  height: number
  left: number
  top: number
  angle: number
}