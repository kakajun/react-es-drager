import React from 'react'
import Drager, { type DragData } from 'react-es-drager'

const MyComponent = () => {
  const handleEvent = (eventName: string) => {
    return (dragData: DragData) => {
      console.log(eventName, dragData)
    }
  }

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
  }
  const onBlur = (val: boolean) => {
    console.log('onBlur', val)
  }

  return (
    <div>
      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 100,
          top: 100,
          angle: 0
        }}
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
