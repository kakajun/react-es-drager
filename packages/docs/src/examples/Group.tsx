import React, { useState, useRef } from 'react'
import Drager, { type DragData } from 'react-es-drager'
import { EditorDataType, GridRect, Area, useArea } from '@es-drager/editor'
import { useId, makeGroup, cancelGroup } from '@es-drager/editor/src/utils'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import './Group.less'

const MyComponent = () => {
  const [data, setData] = useState<EditorDataType>({
    container: {
      gridSize: 10,
      markline: {},
      snapToGrid: true,
      style: {}
    },
    elements: [
      {
        id: useId(),
        component: 'div',
        text: 'div1',
        width: 100,
        height: 100,
        left: 100,
        top: 100,
        style: { border: '1px solid #3a7afe' }
      },
      {
        id: useId(),
        component: 'div',
        text: 'div2',
        width: 100,
        height: 100,
        top: 200,
        left: 300,
        style: { border: '1px solid #3a7afe' }
      }
    ]
  })
  const { t } = useTranslation()
  const editorRef = useRef<HTMLElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const areaRef = useRef(null)
  const [extraDragData, setExtraDragData] = useState({
    prevLeft: 0,
    prevTop: 0
  })

  const editorRect = editorRef.current?.getBoundingClientRect() || ({} as DOMRect)

  const { areaSelected, onEditorMouseDown, onAreaMove, onAreaUp } = useArea(data, areaRef, setData)

  function onDragstart(index: number) {
    if (!areaSelected) {
      data.elements.forEach((item) => (item.selected = false))
    }

    const current = data.elements[index]
    current.selected = true
    setExtraDragData({
      prevLeft: current.left!,
      prevTop: current.top!
    })
    setCurrentIndex(index)
  }

  function onDrag(dragData: DragData) {
    const disX = dragData.left - extraDragData.prevLeft
    const disY = dragData.top - extraDragData.prevTop

    data.elements.forEach((item, index) => {
      if (item.selected && currentIndex !== index) {
        item.left! += disX
        item.top! += disY
      }
    })

    setExtraDragData({
      prevLeft: dragData.left,
      prevTop: dragData.top
    })
  }

  const onChange = (index: number, dragData: DragData) => {
    setData((prevState) => ({
      ...prevState,
      elements: prevState.elements.map((item, i) => (i === index ? { ...item, ...dragData } : item))
    }))
  }

  function handleMakeGroup() {
    setData({
      ...data,
      elements: makeGroup(data.elements, editorRect)
    })
  }

  function handleCancelGroup() {
    setData({
      ...data,
      elements: cancelGroup(data.elements, editorRect)
    })
  }

  return (
    <div className="es-container">
      <div className="es-tools">
        <Button type="primary" className="left-btn" onClick={handleMakeGroup}>
          {t('examples.group')}
        </Button>
        <Button type="primary" onClick={handleCancelGroup}>
          {t('examples.unGroup')}
        </Button>
      </div>
      <div
        ref={editorRef}
        className="es-editor"
        onMouseDown={onEditorMouseDown}
        onClick={(e) => e.stopPropagation()}
      >
        {data.elements.map((item, index) => {
          const DynamicComponent = item.component
          return (
            <Drager
              key={item.id}
              selected={item.selected}
              size={{
                width: item.width,
                height: item.height,
                left: item.left,
                top: item.top,
                angle: item.angle
              }}
              rotatable
              onDragStart={() => onDragstart(index)}
              onDrag={onDrag}
              onChange={(e: DragData) => onChange(index, e)}
              onClick={(e: any) => e.stopPropagation()}
              onMouseDown={(e: any) => e.stopPropagation()}
            >
              <DynamicComponent
                {...item}
                {...item.props}
                style={{
                  ...item.style,
                  width: '100%',
                  height: '100%'
                }}
              >
                {item.text}
              </DynamicComponent>
            </Drager>
          )
        })}

        <GridRect />
        <Area ref={areaRef} onMove={onAreaMove} onUp={onAreaUp} />
      </div>
    </div>
  )
}

export default MyComponent
