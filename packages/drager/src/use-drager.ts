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
  checkDragerCollision: () => boolean | undefined
  dragData: DragData
}

export function useDrager(
  targetRef: React.MutableRefObject<HTMLElement | null>,
  props: DragerProps,
  emit: (event: string, data: DragData) => void
): UseDragerResult {
  const [isMousedown, setIsMousedown] = useState(false)
  const [selected, setSelected] = useState(false)
  const [dragData, setDragData] = useState<DragData>({
    width: props.width,
    height: props.height,
    left: props.left,
    top: props.top,
    angle: props.angle
  })

  const mouseSet = new Set()

  const { marklineEmit } = useMarkline(targetRef, props)

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
    emit && emit('drag-start', dragData)

    const onMousemove = (e: MouseTouchEvent) => {
      if (mouseSet.size > 1) return

      const { clientX, clientY } = getXY(e)
      let moveX = (clientX - downX) / props.scaleRatio + left
      let moveY = (clientY - downY) / props.scaleRatio + top

      if (props.snapToGrid) {
        const { left: curX, top: curY } = dragData
        const diffX = moveX - curX
        const diffY = moveY - curY

        moveX = curX + calcGrid(diffX, props.gridX)
        moveY = curY + calcGrid(diffY, props.gridY)
      }

      if (props.boundary) {
        ;[moveX, moveY] = fixBoundary(moveX, moveY, minX, maxX, minY, maxY)
      }

      setDragData((prev) => ({ ...prev, left: moveX, top: moveY }))

      emit && emit('drag', dragData)

      nextTick(() => {
        const markLine = marklineEmit('drag')!
        if (props.snap) {
          if (markLine.diffX) {
            setDragData((prev) => ({ ...prev, left: prev.left + markLine.diffX }))
          }
          if (markLine.diffY) {
            setDragData((prev) => ({ ...prev, top: prev.top + markLine.diffY }))
          }
        }
      })
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
      emit && emit('drag-end', dragData)
    })
  }

  const getBoundary = () => {
    let minX = 0,
      minY = 0
    const { left, top, height, width, angle } = dragData
    const parentEl = targetRef.current?.offsetParent || document.body
    const parentElRect = getBoundingClientRectByScale(parentEl!, props.scaleRatio)

    if (angle) {
      const rect = getBoundingClientRectByScale(targetRef.current!, props.scaleRatio)
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
      const flag = checkCollision(targetRef.current!, item, props.scaleRatio)
      if (flag) return true
    }
  }

  const clickOutsize = () => {
    setSelected(false)
  }

  const { onKeydown, onKeyup } = useKeyEvent(props, dragData, selected, {
    getBoundary,
    fixBoundary,
    checkDragerCollision,
    emit
  })

  useEffect(() => {
    if (!targetRef.current) return

    if (!dragData.width && !dragData.height) {
      const { width, height } = getBoundingClientRectByScale(targetRef.current, props.scaleRatio)
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
  }, [])

  useEffect(() => {
    if (selected) {
      emit('focus', selected)
      document.addEventListener('click', clickOutsize, { once: true })

      if (!props.disabledKeyEvent) {
        document.addEventListener('keydown', onKeydown)
        document.addEventListener('keyup', onKeyup)
      }
    } else {
      emit('blur', selected)

      if (!props.disabledKeyEvent) {
        document.removeEventListener('keydown', onKeydown)
        document.removeEventListener('keyup', onKeyup)
      }
    }

    return () => {
      document.removeEventListener('click', clickOutsize)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('keyup', onKeyup)
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
