import { DragData } from './drager'
export type MouseTouchEvent = React.MouseEvent | React.TouchEvent
/**
 * 统一处理拖拽事件
 * @param onMousemove 鼠标移动处理函数
 */
export function setupMove(
  onMousemove: (e: MouseTouchEvent) => void,
  onMouseupCb?: (e: MouseTouchEvent) => void
) {
  const onMouseup = (_e: MouseTouchEvent) => {
    onMouseupCb && onMouseupCb(_e)
    document.removeEventListener('mousemove', onMousemove as any)
    document.removeEventListener('mouseup', onMouseup as any)
    document.removeEventListener('mouseleave', onMouseup as any)

    // for mobile
    document.removeEventListener('touchmove', onMousemove as any)
    document.removeEventListener('touchend', onMouseup as any)
  }
  document.addEventListener('mousemove', onMousemove as any)
  document.addEventListener('mouseup', onMouseup as any)
  document.addEventListener('mouseleave', onMouseup as any)

  // for mobile
  document.addEventListener('touchmove', onMousemove as any)
  document.addEventListener('touchend', onMouseup as any)
}

export function getXY(e: MouseTouchEvent) {
  let clientX = 0,
    clientY = 0
  if (isTouchEvent(e)) {
    const touch = e.targetTouches[0] || e.changedTouches[0]
    clientX = touch.pageX
    clientY = touch.pageY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }

  return { clientX, clientY }
}

function isTouchEvent(val: unknown): val is React.TouchEvent {
  const typeStr = Object.prototype.toString.call(val)
  return typeStr.substring(8, typeStr.length - 1) === 'TouchEvent'
}

export const withUnit = (val: number | string = 0) => {
  return parseInt(val + '') + 'px'
}

export const resizableMap = {
  n: 'top',
  s: 'bottom',
  e: 'right',
  w: 'left',
  ne: 'top-right',
  nw: 'top-left',
  se: 'bottom-right',
  sw: 'bottom-left'
}

export const cursorDirectionArray = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
const cursorStartMap = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 }
const cursorMap = {
  0: 0,
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4,
  6: 4,
  7: 5,
  8: 6,
  9: 6,
  10: 7,
  11: 8
}
export const getCursor = (rotateAngle: number, d: string) => {
  const increment = (cursorMap as any)[Math.floor(rotateAngle / 30)]
  const index = (cursorStartMap as any)[d]
  const newIndex = (index + increment) % 8
  return cursorDirectionArray[newIndex]
}

export const getDotList = (angle: number = 0, resizeList?: string[]) => {
  let dots = []
  for (let index = 0; index < cursorDirectionArray.length; index++) {
    const key = cursorDirectionArray[index]

    const [side, position] = (resizableMap as any)[key].split('-')

    const cursor = getCursor(angle, key)

    const style: any = {
      [side]: '0%',
      cursor: cursor + '-resize',
      side: (resizableMap as any)[key]
    }
    if (!position) {
      const side2 = ['top', 'bottom'].includes(side) ? 'left' : 'top'
      style[side2] = '50%'
    } else {
      style[position] = '0%'
    }

    if (!resizeList) {
      // 没有传入缩放默认都显示
      dots.push(style)
    } else {
      if (resizeList.includes((resizableMap as any)[key])) {
        dots.push(style)
      }
    }
  }

  return dots
}

export const degToRadian = (deg: number) => (deg * Math.PI) / 180

export const getLength = (x: number, y: number) => Math.sqrt(x * x + y * y)
const cos = (deg: number) => Math.cos(degToRadian(deg))
const sin = (deg: number) => Math.sin(degToRadian(deg))

export const getNewStyle = (
  type: string,
  rect: any,
  deltaW: number,
  deltaH: number,
  ratio: number | undefined,
  minWidth: number,
  minHeight: number
) => {
  let { width, height, centerX, centerY, rotateAngle } = rect
  const widthFlag = width < 0 ? -1 : 1
  const heightFlag = height < 0 ? -1 : 1
  width = Math.abs(width)
  height = Math.abs(height)

  if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(type)) {
    if (type === 'top-right') {
      deltaH = -deltaH
    } else if (type === 'bottom-left') {
      deltaW = -deltaW
    } else if (type === 'top-left') {
      deltaW = -deltaW
      deltaH = -deltaH
    }

    const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
    width = widthAndDeltaW.width
    deltaW = widthAndDeltaW.deltaW
    const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
    height = heightAndDeltaH.height
    deltaH = heightAndDeltaH.deltaH

    if (ratio) {
      // if (Math.abs(deltaH) > Math.abs(deltaW)) {
      //   deltaW = deltaH * ratio
      //   width = height * ratio
      // } else {
      //   deltaH = deltaW / ratio
      //   height = width / ratio
      // }
      deltaH = deltaW / ratio
      height = width / ratio
    }
  }

  switch (type) {
    case 'right': {
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      if (ratio) {
        deltaH = deltaW / ratio
        height = width / ratio
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle)
        centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle)
      } else {
        // 左边固定
        centerX += (deltaW / 2) * cos(rotateAngle)
        centerY += (deltaW / 2) * sin(rotateAngle)
      }
      break
    }
    case 'top-right': {
      centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle)
      centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle)
      break
    }
    case 'bottom-right': {
      centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle)
      centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle)
      break
    }
    case 'bottom': {
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        deltaW = deltaH * ratio
        width = height * ratio
        // 左上角固定
        centerX += (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle)
        centerY += (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle)
      } else {
        // 上边固定
        centerX -= (deltaH / 2) * sin(rotateAngle)
        centerY += (deltaH / 2) * cos(rotateAngle)
      }
      break
    }
    case 'bottom-left': {
      centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle)
      centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle)
      break
    }
    case 'left': {
      deltaW = -deltaW
      const widthAndDeltaW = setWidthAndDeltaW(width, deltaW, minWidth)
      width = widthAndDeltaW.width
      deltaW = widthAndDeltaW.deltaW
      if (ratio) {
        height = width / ratio
        deltaH = deltaW / ratio
        // 右上角固定
        centerX -= (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle)
        centerY -= (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle)
      } else {
        // 右边固定
        centerX -= (deltaW / 2) * cos(rotateAngle)
        centerY -= (deltaW / 2) * sin(rotateAngle)
      }
      break
    }
    case 'top-left': {
      centerX -= (deltaW / 2) * cos(rotateAngle) - (deltaH / 2) * sin(rotateAngle)
      centerY -= (deltaW / 2) * sin(rotateAngle) + (deltaH / 2) * cos(rotateAngle)
      break
    }
    case 'top': {
      deltaH = -deltaH
      const heightAndDeltaH = setHeightAndDeltaH(height, deltaH, minHeight)
      height = heightAndDeltaH.height
      deltaH = heightAndDeltaH.deltaH
      if (ratio) {
        width = height * ratio
        deltaW = deltaH * ratio
        // 左下角固定
        centerX += (deltaW / 2) * cos(rotateAngle) + (deltaH / 2) * sin(rotateAngle)
        centerY += (deltaW / 2) * sin(rotateAngle) - (deltaH / 2) * cos(rotateAngle)
      } else {
        centerX += (deltaH / 2) * sin(rotateAngle)
        centerY -= (deltaH / 2) * cos(rotateAngle)
      }
      break
    }
  }

  return {
    position: {
      centerX,
      centerY
    },
    size: {
      width: width * widthFlag,
      height: height * heightFlag
    }
  }
}

const setHeightAndDeltaH = (height: number, deltaH: number, minHeight: number) => {
  const expectedHeight = height + deltaH
  if (expectedHeight > minHeight) {
    height = expectedHeight
  } else {
    deltaH = minHeight - height
    height = minHeight
  }
  return { height, deltaH }
}

const setWidthAndDeltaW = (width: number, deltaW: number, minWidth: number) => {
  const expectedWidth = width + deltaW
  if (expectedWidth > minWidth) {
    width = expectedWidth
  } else {
    deltaW = minWidth - width
    width = minWidth
  }
  return { width, deltaW }
}

export const centerToTL = ({ centerX, centerY, width, height, angle }: any): DragData => ({
  top: centerY - height / 2,
  left: centerX - width / 2,
  width,
  height,
  angle
})

export const formatData = (data: DragData, centerX: number, centerY: number) => {
  const { width, height } = data
  return {
    width: Math.abs(width),
    height: Math.abs(height),
    left: centerX - Math.abs(width) / 2,
    top: centerY - Math.abs(height) / 2
  }
}

/**
 * @param diff 移动的距离
 * @param grid 网格大小
 */
export function calcGrid(diff: number, grid: number) {
  // 得到每次缩放的余数
  const r = Math.abs(diff) % grid

  // 正负grid
  const mulGrid = diff > 0 ? grid : -grid
  let result = 0
  // 余数大于grid的1/2
  if (r > grid / 2) {
    result = mulGrid * Math.ceil(Math.abs(diff) / grid)
  } else {
    result = mulGrid * Math.floor(Math.abs(diff) / grid)
  }

  return result
}

/**
 * 检查两个元素是否发生碰撞
 * @param element1 拖拽元素
 * @param element2 碰撞对象
 * @returns
 */
export function checkCollision(element1: Element, element2: Element, scaleRatio: number) {
  if (!element1 || !element2) return false
  const rect1 = getBoundingClientRectByScale(element1, scaleRatio)
  const rect2 = getBoundingClientRectByScale(element2, scaleRatio)

  if (
    rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.top + rect1.height > rect2.top
  ) {
    return true // 发生碰撞
  }

  return false // 未发生碰撞
}

/**
 * 获取缩放后得Rect
 */
export const getBoundingClientRectByScale = (el: HTMLElement | Element, scaleRatio: number) => {
  var curRect = el.getBoundingClientRect()
  return {
    ...curRect,
    left: curRect.left / scaleRatio,
    top: curRect.top / scaleRatio,
    right: curRect.right / scaleRatio,
    bottom: curRect.bottom / scaleRatio,
    width: curRect.width / scaleRatio,
    height: curRect.height / scaleRatio
  } as DOMRect
}

// 计算旋转矩阵，围绕元素中心旋转
const rotateMatrix = (x: number, y: number, centerX: number, centerY: number, angle: number) => {
  const radian = (angle * Math.PI) / 180
  const translatedX = x - centerX
  const translatedY = y - centerY
  return [
    translatedX * Math.cos(radian) - translatedY * Math.sin(radian) + centerX,
    translatedX * Math.sin(radian) + translatedY * Math.cos(radian) + centerY
  ]
}

// 获取旋转后的边界
export const getRotatedBounds = (d: DragData, angle: number) => {
  const centerX = d.left + d.width / 2
  const centerY = d.top + d.height / 2
  const corners = [
    rotateMatrix(d.left, d.top, centerX, centerY, angle),
    rotateMatrix(d.left + d.width, d.top, centerX, centerY, angle),
    rotateMatrix(d.left, d.top + d.height, centerX, centerY, angle),
    rotateMatrix(d.left + d.width, d.top + d.height, centerX, centerY, angle)
  ]

  const rotatedMinX = Math.min(...corners.map((corner) => corner[0]))
  const rotatedMaxX = Math.max(...corners.map((corner) => corner[0]))
  const rotatedMinY = Math.min(...corners.map((corner) => corner[1]))
  const rotatedMaxY = Math.max(...corners.map((corner) => corner[1]))

  return { rotatedMinX, rotatedMaxX, rotatedMinY, rotatedMaxY }
}
