import React, { useEffect, useState, useRef } from 'react'
import { DragerProps, DragData } from './drager'
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
  isMousedown: boolean
  selected: boolean
  setSelected: (selected: boolean) => void
  setDragData: (data: DragData) => void
  getBoundary: () => number[]
  checkDragerCollision: () => boolean
  dragData: DragData
}

export function useDrager(
  targetRef: React.MutableRefObject<HTMLDivElement | null>,
  props: DragerProps
): UseDragerResult {
  const { onDragStart, onDrag, onDragEnd, onFocus, onBlur } = props
  const scaleRatio = props.scaleRatio || 1
  const [isMousedown, setIsMousedown] = useState(false)
  const [selected, setSelected] = useState(false)
  const [dragData, setDragData] = useState<DragData>({
    width: props.width || 100,
    height: props.height || 100,
    left: props.left || 0,
    top: props.top || 0,
    angle: props.angle || 0
  })
  const { marklineEmit } = useMarkline(targetRef, props)
  // 限制多个鼠标键按下的情况
  const mouseSet = new Set()



  function onMousedown(e: MouseTouchEvent) {
    mouseSet.add((e as MouseEvent).button)
    if (props.disabled) return

    setIsMousedown(true)
    setSelected(true)

    let { clientX: downX, clientY: downY } = getXY(e)
    const { left, top } = dragData
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0

    if (props.boundary) {
      ;[minX, maxX, minY, maxY] = getBoundary()
    }
    marklineEmit('drag-start')
    onDragStart && onDragStart(dragData)
    let newDragData = dragData
    const onMousemove = (e: MouseTouchEvent) => {
      if (mouseSet.size > 1) return
      const { clientX, clientY } = getXY(e)
      let moveX = (clientX - downX) / scaleRatio + left
      let moveY = (clientY - downY) / scaleRatio + top

      if (props.snapToGrid) {
        const { left: curX, top: curY } = dragData
        const diffX = moveX - curX
        const diffY = moveY - curY

        moveX = curX + calcGrid(diffX, props.gridX || 50)
        moveY = curY + calcGrid(diffY, props.gridY || 50)
      }

      if (props.boundary) {
        ;[moveX, moveY] = fixBoundary(moveX, moveY, minX, maxX, minY, maxY)
      }
      newDragData = { ...dragData, left: moveX, top: moveY }
      setDragData((prev) => ({ ...prev, left: moveX, top: moveY }))
      onDrag && onDrag(newDragData)
    }

    setupMove(onMousemove, (e: MouseTouchEvent) => {
      if (props.checkCollision) {
        const isCollision = checkDragerCollision()
        if (isCollision) {
          setDragData((prev) => ({ ...prev, top, left }))
        }
      }
      mouseSet.clear()
      setIsMousedown(false)
      marklineEmit('drag-end')
      onDragEnd && onDragEnd(newDragData)
    })
  }

  useEffect(() => {
    const handleDrag = async () => {
      const markLine = marklineEmit('drag')

      if (props.snap && markLine) {
        if (markLine.diffX) {
          dragData.left += markLine.diffX
        }

        if (markLine.diffY) {
          dragData.top += markLine.diffY
        }
      }
    }

    handleDrag()
  }, [props.snap, dragData])

  const getBoundary = () => {
    let minX = 0,
      minY = 0
    const { left, top, height, width, angle } = dragData
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

  const { handleKeyDown, handleKeyUp } = useKeyEvent(props, dragData, selected, {
    getBoundary,
    fixBoundary,
    checkDragerCollision
  })

  useEffect(() => {
    if (!targetRef.current) return

    if (!dragData.width && !dragData.height) {
      const { width, height } = getBoundingClientRectByScale(targetRef.current, scaleRatio || 1)
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
  }, [dragData])

  useEffect(() => {
    if (selected) {
      onFocus && onFocus(selected)
      document.addEventListener('click', clickOutsize, { once: true })

      if (!props.disabledKeyEvent) {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
      }
    } else {
      onBlur && onBlur(selected)
      if (!props.disabledKeyEvent) {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }

    return () => {
      document.removeEventListener('click', clickOutsize)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [selected])

  return {
    isMousedown,
    selected,
    setSelected,
    setDragData,
    dragData,
    getBoundary,
    checkDragerCollision
  }
}
