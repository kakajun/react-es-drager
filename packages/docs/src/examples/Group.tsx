import React, { useState, useRef } from 'react'
import Drager, { DragData } from 'react-es-drager'
import { ComponentType, EditorDataType, GridRect, Area, useArea } from '@es-drager/editor'
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

  const { areaSelected, onEditorMouseDown, onAreaMove, onAreaUp } = useArea(data, areaRef)

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

  function onChange(dragData: DragData, item: ComponentType) {
    Object.keys(dragData).forEach((key) => {
      item[key as keyof DragData] = dragData[key as keyof DragData]
    })
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
        <Button type="primary" onClick={handleMakeGroup}>
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
        {data.elements.map((item, index) => (
          <Drager
            key={item.id}
            {...item}
            rotatable
            onDragStart={() => onDragstart(index)}
            onDrag={onDrag}
            onChange={(event) => onChange(event, item)}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              is={item.component}
              {...item.props}
              style={{
                ...item.style,
                width: '100%',
                height: '100%'
              }}
            >
              {item.text}
            </div>
          </Drager>
        ))}

        <GridRect />
        <Area ref={areaRef} onMove={onAreaMove} onUp={onAreaUp} />
      </div>
    </div>
  )
}

export default MyComponent
