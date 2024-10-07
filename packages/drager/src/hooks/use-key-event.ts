
import { DragerProps, DragData } from '../drager'

type UtilFN = {
  getBoundary: () => number[]
  fixBoundary: (
    moveX: number,
    moveY: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) => [number, number]
  checkDragerCollision: () => boolean
  emit: (event: string, ...args: any[]) => void
}

export function useKeyEvent(
  props: DragerProps,
  dragData: DragData,
  selected: boolean,
  { getBoundary, fixBoundary, checkDragerCollision, emit }: UtilFN
) {
  let oldLeft = 0
  let oldTop = 0

  // 键盘事件
  const handleKeyDown = (e: KeyboardEvent) => {
    let { left: moveX, top: moveY } = dragData
    if (!oldLeft) oldLeft = moveX
    if (!oldTop) oldTop = moveY
    const gridX = props.gridX ?? 50
    const gridY = props.gridY ?? 50
    if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      // 左右键修改left
      const isRight = e.key === 'ArrowRight'
      // 默认移动1像素距离
      let diff = isRight ? 1 : -1
      // 如果开启网格，移动gridX距离
      if (props.snapToGrid) {
        diff = isRight ? gridX : -gridX
      }
      moveX = moveX + diff
    } else if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      // 上下键修改top
      const isDown = e.key === 'ArrowDown'
      // 默认移动1像素距离
      let diff = isDown ? 1 : -1
      // 如果开启网格，移动gridY距离
      if (props.snapToGrid) {
        diff = isDown ? gridY : -gridY
      }
      moveY = moveY + diff
    }

    // 边界判断
    if (props.boundary) {
      const [minX, maxX, minY, maxY] = getBoundary()
      ;[moveX, moveY] = fixBoundary(moveX, moveY, minX, maxX, minY, maxY)
    }

    // 更新拖拽数据
    dragData.left = moveX
    dragData.top = moveY
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      // 检测碰撞
      if (props.checkCollision && checkDragerCollision()) {
        dragData.left = oldLeft
        dragData.top = oldTop
      }
    }
    oldLeft = 0
    oldTop = 0
  }

  return {
    handleKeyDown,
    handleKeyUp
  }
}
