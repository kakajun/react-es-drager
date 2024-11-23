import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
import { DragData, DragerProps } from './drager.ts'
import { useDrager } from './use-drager'
import './drager.less'

type Slot = React.ReactNode | null
type ChildrenSlots = [Slot, Slot, Slot]

const Drager: React.FC<DragerProps> = (props) => {
  const {
    type: propsType = 'rect',
    disabled,
    border = true,
    resizable = true,
    rotatable,
    zIndex = 1,
    color = '#3a7afe',
    scaleRatio = 1,
    resizeList,
    minWidth = 1,
    minHeight = 1,
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

  const dragRef = useRef<HTMLDivElement>(null)

  const {
    selected,
    setDragData,
    triggerEvent,
    currentDragData,
    isMousedown,
    getBoundary,
    checkDragerCollision
  } = useDrager(dragRef, props)

  const [dotList, setDotList] = useState(getDotList(0, resizeList))

  const showRotate = useMemo(
    () => rotatable && !disabled && selected,
    [resizable, disabled, selected]
  )
  const showResize = useMemo(() => resizable && !disabled, [resizable, disabled])

  const dots = useMemo(() => {
    return props.type !== 'text'
      ? dotList
      : dotList.filter((d) => !['top', 'bottom'].includes(d.side))
  }, [props.type, dotList])

  const dragStyle = useMemo(() => {
    const { width, height, left, top, angle } = currentDragData
    const style: React.CSSProperties = {}
    // 优先考虑props.size
    style.width = props.size?.width ?? withUnit(width)
    const curentHeight = props.size?.height ?? height
    if (curentHeight) {
      if (props.type === 'text') {
        style.fontSize = curentHeight + 'px'
      } else {
        style.height = withUnit(curentHeight)
      }
    }
    let transform: string[] = [
      `translateX(${props.size?.left ?? withUnit(left)})`,
      `translateY(${props.size?.top ?? withUnit(top)})`,
      `rotate(${props.size?.angle ?? angle}deg)`
    ]
    return {
      ...style,
      zIndex: zIndex,
      transform: transform.join(' '),
      '--es-drager-color': color
    }
  }, [currentDragData, props.size])

  const handleRotateEnd = (angle: number) => {
    setDotList(getDotList(angle, resizeList))
    triggerEvent('rotate-end', { ...currentDragData, angle })
  }

  const onDotMousedown = useCallback(
    (dotInfo: any, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (disabled) return
      e.stopPropagation()
      const { clientX, clientY } = getXY(e)
      const downX = clientX
      const downY = clientY
      const { width, height, left, top } = currentDragData
      const centerX = left + width / 2
      const centerY = top + height / 2

      const rect = {
        width,
        height,
        centerX,
        centerY,
        rotateAngle: currentDragData.angle
      }
      const type = dotInfo.side
      triggerEvent('resize-start', currentDragData)

      let boundaryInfo: number[] = []
      if (boundary) {
        boundaryInfo = getBoundary()
      }

      let aspectRatio = props.aspectRatio
      if (['text', 'image'].includes(propsType) && type.includes('-')) {
        aspectRatio = rect.width / rect.height
      }

      let d: DragData | null = null
      const onMousemove = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
      ) => {
        const { clientX, clientY } = getXY(e)
        // 距离
        let deltaX = (clientX - downX) / scaleRatio
        let deltaY = (clientY - downY) / scaleRatio

        // 开启网格缩放
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
          angle: currentDragData.angle
        })

        d = {
          ...currentDragData,
          ...formatData(pData, centerX, centerY)
        }

        // 最大宽高限制
        if (maxWidth > 0) {
          d.width = Math.min(d.width, maxWidth)
        }
        if (maxHeight > 0) {
          d.height = Math.min(d.height, maxHeight)
        }

        // 如果开启了边界，则调用 fixResizeBoundary 函数处理
        if (boundary) {
          d = fixResizeBoundary(d, boundaryInfo, ratio)
        }
        !props.size && setDragData(d)
        triggerEvent('resize', d)
      }

      setupMove(onMousemove, () => {
        if (checkCollision && checkDragerCollision()) {
          !props.size && setDragData({ ...currentDragData, width, height, left, top })
        }

        d && triggerEvent('resize-end', d)
      })
    },
    [currentDragData]
  )

  const fixResizeBoundary = (d: DragData, boundaryInfo: number[], ratio: number | undefined) => {
    const [minX, minY, parentWidth, parentHeight] = boundaryInfo
    const isMinLeft = d.left < minX
    const isMaxLeft = d.left + d.width > parentWidth
    const isMinTop = d.top < minY
    const isMaxTop = d.top + d.height > parentHeight

    if (isMinLeft) {
      d.left = minX
      d.width = currentDragData.width
    }

    if (isMinTop) {
      d.top = minY
      d.height = currentDragData.height
    }

    if (isMaxLeft || isMaxTop) {
      if (isMaxLeft) {
        d.left = currentDragData.left
      }

      if (isMaxTop) {
        d.top = currentDragData.top
      }

      if (!isMaxTop) {
        // 宽度变为parentWidth减去left，这样元素的left+width的和刚好等于parentWidth
        d.width = parentWidth - d.left
      }

      if (!isMaxLeft) {
        // 宽度变为parentHeight减去top，这样元素的top+height的和刚好等于parentHeight
        d.height = parentHeight - d.top
      }
    }

    if ((isMaxTop || isMinTop) && ratio) {
      d.width = currentDragData.width
      d.left = currentDragData.left
    }

    if ((isMaxLeft || isMinLeft) && ratio) {
      d.height = currentDragData.height
      d.top = currentDragData.top
    }

    return d
  }

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
    !props.size && setDragData({ ...currentDragData, angle: rotate })
    triggerEvent('rotate', { ...currentDragData, angle: rotate })
  }
  const Wrapper: React.ElementType = props.tag || 'div'
  return (
    <Wrapper
      ref={dragRef}
      className={[
        'es-drager',
        `es-drager-${propsType}`,
        border ? 'border' : '',
        selected ? 'selected' : '',
        disabled ? 'disabled' : '',
        isMousedown ? 'dragging' : ''
      ].join(' ')}
      style={dragStyle}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {defaultSlot}
      {showResize && (
        <>
          {dots.map((item, index) => (
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
          dragData={currentDragData}
          element={dragRef.current}
          onRotate={setRotate}
          onRotateStart={(data) => triggerEvent('rotate-start', data)}
          onRotateEnd={handleRotateEnd}
        >
          {rotateSlot}
        </Rotate>
      )}
    </Wrapper>
  )
}

export default Drager
