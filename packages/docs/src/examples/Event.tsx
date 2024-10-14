import React, { useState, useEffect } from 'react'
import Drager, { type DragData } from 'react-es-drager'

const MyComponent = () => {
  const handleEvent = (eventName: string) => {
    return (dragData: DragData) => {
      console.log(eventName, dragData)
    }
  }

  // 定义所有事件处理器
  const [isFocused, setIsFocused] = useState(false)

  const onChange = handleEvent('onChange')
  const onDrag = handleEvent('onDrag')
  const onDragStart = handleEvent('onDragStart')
  const onDragEnd = handleEvent('onDragEnd')
  const onResize = handleEvent('onResize')
  const onResizeStart = handleEvent('onResizeStart')
  const onResizeEnd = handleEvent('onResizeEnd')
  const onRotate = handleEvent('onRotate')
  const onRotateStart = handleEvent('onRotateStart')
  const onRotateEnd = handleEvent('onRotateEnd')
  const onFocus = (val: boolean) => {
    console.log('onFocus', val)
    setIsFocused(val)
  }
  const onBlur = (val: boolean) => {
    console.log('onBlur', val)
    setIsFocused(val)
  }

  return (
    <div>
      <Drager
        width={100}
        height={100}
        left={100}
        top={100}
        rotatable
        onChange={onChange}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
        onRotate={onRotate}
        onRotateStart={onRotateStart}
        onRotateEnd={onRotateEnd}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  )
}

export default MyComponent
