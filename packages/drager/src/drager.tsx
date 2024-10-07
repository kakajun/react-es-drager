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
const Drager: React.FC<DragerProps> = (props) => {
  const {
    // tag,
    // className,
    selected: propsSelected = false,
    disabled,
    border = true,
    resizable = true,
    rotatable,
    zIndex,
    color = '#3a7afe',
    width = 100,
    // height,
    // left,
    // top,
    // angle,
    resizeList,
    // minWidth,
    // minHeight,
    // aspectRatio,
    // equalProportion,
    maxWidth,
    maxHeight,
    scaleRatio,
    snapToGrid,
    gridX = 50,
    gridY = 50,
    boundary,
    checkCollision
  } = props
  const dragRef = useRef<HTMLElement | null>(null)
  const emitFn = (type: string, ...args: any[]) => {
    console.log(`Emitting ${type}`, ...args) // 示例日志输出
  }
  const {
    selected,
    setSelected,
    // setDragData,
    dragData,
    isMousedown
    // getBoundary,
    // checkDragerCollision
  } = useDrager(dragRef, props, emitFn)

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
      {props.children}
    </div>
  )
}

export default Drager
