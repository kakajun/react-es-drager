import React, { useEffect, useState } from 'react'
import type { DragerProps, DragData, EventType } from './drager'
import {
  setupMove,
  MouseTouchEvent,
  calcGrid,
  getXY,
  checkCollision,
  getBoundingClientRectByScale
} from './utils'
import { useMarkline, useKeyEvent } from './hooks'

interface UseDragerResult {
  triggerEvent: (event: EventType, data: DragData) => void
  isMousedown: boolean
  selected: boolean
  setSelected: (selected: boolean) => void
  setDragData: React.Dispatch<React.SetStateAction<DragData>>
  getBoundary: () => number[]
  checkDragerCollision: () => boolean
  currentDragData: DragData
}
// 默认尺寸
const DEFAULT_SIZE = {
  width: 100,
  height: 100,
  left: 0,
  top: 0,
  angle: 0
}

export function useDrager(
  targetRef: React.MutableRefObject<HTMLDivElement | null>,
  props: DragerProps
): UseDragerResult {
  const {
    guideline = {
      h: [],
      v: []
    },
    scaleRatio = 1,
    snapThreshold = 10,
    onDragStart,
    onDrag,
    onDragEnd,
    onChange,
    onResize,
    onResizeStart,
    onResizeEnd,
    onRotate,
    onRotateStart,
    onRotateEnd,
    onFocus,
    onBlur
  } = props

  const triggerEvent = (event: EventType, data: DragData) => {
    onChange?.(data)
    event === 'drag' && onDrag?.(data)
    event === 'drag-start' && onDragStart?.(data)
    event === 'drag-end' && onDragEnd?.(data)
    event === 'resize' && onResize?.(data)
    event === 'rotate' && onRotate?.(data)
    event === 'resize-start' && onResizeStart?.(data)
    event === 'resize-end' && onResizeEnd?.(data)
    event === 'rotate-start' && onRotateStart?.(data)
    event === 'rotate-end' && onRotateEnd?.(data)
  }
  // 获取组件的尺寸属性
  const propsSize = props.size || props.defaultSize || DEFAULT_SIZE

  // const scaleRatio = scaleRatio || 1
  const [isMousedown, setIsMousedown] = useState(false)
  const [selected, setSelected] = useState(props.selected || false)
  useEffect(() => {
    if (!isMousedown) {
      // 由于有些是吸附过去的, 需要把最新的值传出去
      triggerEvent('drag-end', dragData)
    }
  }, [isMousedown])
  useEffect(() => {
    setSelected(props.selected || false)
  }, [props.selected])

  const [dragData, setDragData] = useState<DragData>({
    width: propsSize.width || 0,
    height: propsSize.height || 0,
    left: propsSize.left || 0,
    top: propsSize.top || 0,
    angle: propsSize.angle || 0
  })

  const currentDragData = {
    ...(props.size || dragData),
    angle: props.size?.angle ?? dragData.angle // 确保 angle 始终存在
  }

  const { marklineEmit } = useMarkline(targetRef, props)
  // 限制多个鼠标键按下的情况
  const mouseSet = new Set()

  function onMousedown(e: MouseTouchEvent) {
    mouseSet.add((e as MouseEvent).button)
    if (props.disabled) return
    setIsMousedown(true)
    setSelected(true)

    let { clientX: downX, clientY: downY } = getXY(e)
    const { left, top, width, height } = currentDragData
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0

    if (props.boundary) {
      ;[minX, maxX, minY, maxY] = getBoundary()
    }
    marklineEmit('drag-start')
    triggerEvent('drag-start', currentDragData)

    let newDragData = currentDragData
    const onMousemove = (e: MouseTouchEvent) => {
      if (mouseSet.size > 1) return
      const { clientX, clientY } = getXY(e)
      let moveX = (clientX - downX) / scaleRatio + left
      let moveY = (clientY - downY) / scaleRatio + top

      // 是否开启网格对齐
      if (props.snapToGrid) {
        // 当前位置
        const { left: curX, top: curY } = currentDragData
        // 移动距离
        const diffX = moveX - curX
        const diffY = moveY - curY

        // 计算网格移动距离
        moveX = curX + calcGrid(diffX, props.gridX || 50)
        moveY = curY + calcGrid(diffY, props.gridY || 50)
      }

      if (guideline.v && guideline.v.length) {
        const guideSnapsV = guideline.v.slice()
        // 检查 left 是否接近 guideSnapsV 中的某个值
        for (const snap of guideSnapsV) {
          if (Math.abs(snap - moveX) < snapThreshold / scaleRatio) {
            moveX = snap
            break
          }
        }

        // 检查 left + width 是否接近 guideSnapsV 中的某个值
        const rightEdge = moveX + width
        for (const snap of guideSnapsV) {
          if (Math.abs(snap - rightEdge) < snapThreshold / scaleRatio) {
            moveX = snap - width
            break
          }
        }
      }

      if (guideline.h && guideline.h.length) {
        // 水平方向吸附,两个y方向吸附, top和 top+height 都吸附
        const guideSnapsH = guideline.h.slice()
        // 检查 top 是否接近 guideSnapsH 中的某个值
        for (const snap of guideSnapsH) {
          if (Math.abs(snap - moveY) < snapThreshold / scaleRatio) {
            moveY = snap
            break
          }
        }
        // 检查 top + height 是否接近 guideSnapsH 中的某个值
        const bottomEdge = moveY + height
        for (const snap of guideSnapsH) {
          if (Math.abs(snap - bottomEdge) < snapThreshold / scaleRatio) {
            moveY = snap - height
            break
          }
        }
      }

      if (props.boundary) {
        ;[moveX, moveY] = fixBoundary(moveX, moveY, minX, maxX, minY, maxY)
      }
      newDragData = { ...currentDragData, left: moveX, top: moveY }
      !props.size && setDragData(newDragData as DragData)
      triggerEvent('drag', newDragData)
    }

    setupMove(onMousemove, (e: MouseTouchEvent) => {
      if (props.checkCollision) {
        const isCollision = checkDragerCollision()
        if (isCollision) {
          !props.size && setDragData((prev) => ({ ...prev, top, left }))
          triggerEvent('drag-end', currentDragData)
        }
      }
      mouseSet.clear()
      setIsMousedown(false)
      marklineEmit('drag-end')
    })
  }

  useEffect(() => {
    if (props.markline && isMousedown) {
      const markLine = marklineEmit('drag')
      if (props.snap && markLine) {
        if (markLine.diffX) {
          const tempDatas = {
            ...currentDragData,
            left: currentDragData.left + (markLine?.diffX || 0)
          }
          setDragData(tempDatas)
          onChange?.(tempDatas)
        }

        if (markLine.diffY) {
          const tempDatas = {
            ...currentDragData,
            top: currentDragData.top + (markLine?.diffY || 0)
          }
          setDragData(tempDatas)
          onChange?.(tempDatas)
        }
      }
    }
  }, [props.size, currentDragData])

  const getBoundary = () => {
    let minX = 0,
      minY = 0
    const { left, top, height, width, angle } = currentDragData
    const parentEl = targetRef.current?.offsetParent || document.body
    const parentElRect = getBoundingClientRectByScale(parentEl!, scaleRatio)

    if (angle) {
      const rect = getBoundingClientRectByScale(targetRef.current!, scaleRatio)
      minX = rect.left - Math.floor(left - (rect.width - width) + parentElRect.left)
      minY = rect.top - Math.floor(top - (rect.height - height) + parentElRect.top)
    }

    const maxX = parentElRect.width - width
    const maxY = parentElRect.height - height
    return [minX, maxX - minX, minY, maxY - minY, parentElRect.width, parentElRect.height]
  }

  const fixBoundary = (
    moveX: number,
    moveY: number,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) => {
    moveX = moveX < minX ? minX : moveX
    moveX = moveX > maxX ? maxX : moveX
    moveY = moveY < minY ? minY : moveY
    moveY = moveY > maxY ? maxY : moveY
    return [moveX, moveY]
  }

  const checkDragerCollision = () => {
    const parentEl = targetRef.current?.offsetParent || document.body
    const broList = Array.from(parentEl.children).filter((item) => {
      return item !== targetRef.current && item.classList.contains('es-drager')
    })
    for (let i = 0; i < broList.length; i++) {
      const item = broList[i]
      const flag = checkCollision(targetRef.current!, item, scaleRatio || 1)
      if (flag) return true
    }
    return false
  }

  const clickOutsize = () => {
    setSelected(false)
  }

  const { handleKeyDown, handleKeyUp } = useKeyEvent(
    props,
    currentDragData,
    setDragData,
    triggerEvent,
    {
      getBoundary,
      fixBoundary,
      checkDragerCollision
    }
  )

  useEffect(() => {
    if (!targetRef.current) return
    // 只有文字才没有宽高,处理文字的
    if (!currentDragData.width && !currentDragData.height) {
      const { width, height } = getBoundingClientRectByScale(targetRef.current, scaleRatio || 1)
      !props.size &&
        setDragData((prev) => ({
          ...prev,
          width: width || 100,
          height: height || 100
        }))
    }
    targetRef.current.addEventListener('mousedown', onMousedown)
    targetRef.current.addEventListener('touchstart', onMousedown, { passive: true })
    return () => {
      targetRef.current?.removeEventListener('mousedown', onMousedown)
      targetRef.current?.removeEventListener('touchstart', onMousedown)
    }
  }, [dragData, props.size])

  useEffect(() => {
    if (selected) {
      onFocus && onFocus(selected)
      document.addEventListener('click', clickOutsize, { once: true })

      if (!props.disabledKeyEvent) {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
      }
    }

    return () => {
      onBlur && onBlur(selected)
      if (!props.disabledKeyEvent) {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [selected])

  return {
    triggerEvent,
    isMousedown,
    selected,
    setSelected,
    setDragData,
    currentDragData,
    getBoundary,
    checkDragerCollision
  }
}
