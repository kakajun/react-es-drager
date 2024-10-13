import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  formatData,
  withUnit,
  getDotList,
  getLength,
  degToRadian,
  getNewStyle,
  centerToTL,
  calcGrid,
  setupMove,
  getXY,
  MouseTouchEvent
} from './utils'
import Rotate from './rotate'
import { DragData, DragerProps, EventType } from './drager.ts'
import { useDrager } from './use-drager'
import './drager.less'

type Slot = React.ReactNode | null
type ChildrenSlots = [Slot, Slot, Slot]

const Drager: React.FC<DragerProps> = (props) => {
  const {
    // tag,
    // className,
    selected: propsSelected = false,
    disabled,
    border = true,
    resizable = true,
    rotatable,
    zIndex = 1,
    color = '#3a7afe',
    width = 100,
    scaleRatio = 1,
    // height,
    // left,
    // top,
    // angle,
    resizeList,
    minWidth = 1,
    minHeight = 1,
    aspectRatio = 1,
    equalProportion,
    maxWidth = 99999,
    maxHeight = 9999,
    snapToGrid,
    gridX = 50,
    gridY = 50,
    boundary,
    children,
    checkCollision
  } = props

  const dragRef = useRef<HTMLElement | null>(null)

  const emitFn = (type: string, ...args: any[]) => {
    // console.log(`Emitting ${type}`, ...args) // 示例日志输出
  }
  const {
    selected,
    setSelected,
    setDragData,
    dragData,
    isMousedown,
    getBoundary,
    checkDragerCollision
  } = useDrager(dragRef, props, emitFn)

  const [dotList, setDotList] = useState(getDotList(0, resizeList))

  const handleRotateEnd = (angle: number) => {
    setDotList(getDotList(angle, resizeList))
  }

  const onDotMousedown = (dotInfo: any, e: MouseTouchEvent) => {
    if (disabled) return

    e.stopPropagation()

    const { clientX, clientY } = getXY(e)
    const downX = clientX
    const downY = clientY
    const { width, height, left, top } = dragData

    const centerX = left + width / 2
    const centerY = top + height / 2

    const rect = {
      width,
      height,
      centerX,
      centerY,
      rotateAngle: dragData.angle
    }
    const type = dotInfo.side
    emitFn('resize-start', dragData)
    let boundaryInfo: number[] = []
    if (boundary) {
      boundaryInfo = getBoundary()
    }

    const onMousemove = (e: MouseTouchEvent) => {
      const { clientX, clientY } = getXY(e)
      let deltaX = (clientX - downX) / scaleRatio
      let deltaY = (clientY - downY) / scaleRatio

      if (snapToGrid) {
        deltaX = calcGrid(deltaX, gridX)
        deltaY = calcGrid(deltaY, gridY)
      }

      const alpha = Math.atan2(deltaY, deltaX)
      const deltaL = getLength(deltaX, deltaY)
      const isShiftKey = e.shiftKey

      const beta = alpha - degToRadian(rect.rotateAngle)
      const deltaW = deltaL * Math.cos(beta)
      const deltaH = deltaL * Math.sin(beta)
      const ratio =
        (equalProportion || isShiftKey) && !aspectRatio ? rect.width / rect.height : aspectRatio

      const {
        position: { centerX, centerY },
        size: { width, height }
      } = getNewStyle(
        type,
        { ...rect, rotateAngle: rect.rotateAngle },
        deltaW,
        deltaH,
        ratio,
        minWidth,
        minHeight
      )

      const pData = centerToTL({
        centerX,
        centerY,
        width,
        height,
        angle: dragData.angle
      })

      let d = {
        ...dragData,
        ...formatData(pData, centerX, centerY)
      }

      if (maxWidth > 0) {
        d.width = Math.min(d.width, maxWidth)
      }
      if (maxHeight > 0) {
        d.height = Math.min(d.height, maxHeight)
      }

      if (boundary) {
        d = fixResizeBoundary(d, boundaryInfo, ratio)
      }

      setDragData(d)
      emitFn('resize', dragData)
    }

    setupMove(onMousemove, () => {
      if (checkCollision && checkDragerCollision()) {
        setDragData({ ...dragData, width, height, left, top })
      }
      emitFn('resize-end', dragData)
    })
  }

  const fixResizeBoundary = (d: DragData, boundaryInfo: number[], ratio: number | undefined) => {
    const [minX, maxX, minY, maxY, parentWidth, parentHeight] = boundaryInfo

    const isMinLeft = d.left < minX
    const isMaxLeft = d.left + d.width > parentWidth
    const isMinTop = d.top < minY
    const isMaxTop = d.top + d.height > parentHeight

    if (isMinLeft) {
      d.left = minX
      d.width = dragData.width
    }

    if (isMinTop) {
      d.top = minY
      d.height = dragData.height
    }

    if (isMaxLeft || isMaxTop) {
      if (isMaxLeft) {
        d.left = dragData.left
      }

      if (isMaxTop) {
        d.top = dragData.top
      }

      if (!isMaxTop) {
        d.width = parentWidth - d.left
      }

      if (!isMaxLeft) {
        d.height = parentHeight - d.top
      }
    }

    if ((isMaxTop || isMinTop) && ratio) {
      d.width = dragData.width
      d.left = dragData.left
    }

    if ((isMaxLeft || isMinLeft) && ratio) {
      d.height = dragData.height
      d.top = dragData.top
    }

    return d
  }
  const showRotate = useMemo(
    () => rotatable && !disabled && selected,
    [resizable, disabled, selected]
  )
  const showResize = useMemo(() => resizable && !disabled, [resizable, disabled])

  useEffect(() => {
    setSelected(propsSelected)
  }, [propsSelected])
  const dragStyle = useMemo(() => {
    const { width, height, left, top, angle } = dragData
    const style: any = {}
    if (width) {
      style.width = withUnit(width)
    }
    if (height) {
      style.height = withUnit(height)
    }
    return {
      ...style,
      left: withUnit(left),
      top: withUnit(top),
      zIndex: zIndex,
      transform: `rotate(${angle}deg)`,
      '--es-drager-color': color
    }
  }, [dragData, zIndex, color]) // 依赖项列表

  const [defaultSlot, resizeSlot, rotateSlot] = React.Children.toArray(children).reduce(
    (acc: ChildrenSlots, child: React.ReactNode) => {
      if (React.isValidElement(child)) {
        const slot = child.props.slot
        if (slot === 'rotate') {
          acc[2] = child
        } else if (slot === 'resize') {
          acc[1] = child
        } else {
          acc[0] = child
        }
      } else {
        acc[0] = child
      }
      return acc
    },
    [null, null, null]
  )
  const setRotate = (rotate: number) => {
    setDragData({ ...dragData, angle: rotate })
    emitFn('rotate', rotate)
  }
  return (
    <div
      ref={dragRef}
      className={[
        'es-drager',
        border ? 'border' : '',
        selected ? 'selected' : '',
        disabled ? 'disabled' : '',
        isMousedown ? 'dragging' : ''
      ].join(' ')}
      style={dragStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {defaultSlot}
      {showResize && (
        <>
          {dotList.map((item, index) => (
            <div
              key={index}
              className="es-drager-dot"
              data-side={item.side}
              style={{ ...item }}
              onMouseDown={(e) => onDotMousedown(item, e)}
              onTouchStart={(e) => onDotMousedown(item, e)}
            >
              {resizeSlot || <div className="es-drager-dot-handle" />}
            </div>
          ))}
        </>
      )}

      {showRotate && (
        <Rotate
          angle={dragData.angle}
          element={dragRef.current}
          onRotate={setRotate}
          onRotateStart={() => emitFn('rotate-start', dragData)}
          onRotateEnd={handleRotateEnd}
        >
          {rotateSlot}
        </Rotate>
      )}
    </div>
  )
}

export default Drager
