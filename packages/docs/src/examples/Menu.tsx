import React, { useState, useEffect, useRef } from 'react'
import Drager, { DragData } from 'react-es-drager'
import { ComponentType, EditorDataType, ToolType, GridRect, useActions } from '@es-drager/editor'
import { useId } from '@es-drager/editor/src/utils'
import { $dialog, $upload } from '@es-drager/editor/src/components/common'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()
  const data = useRef<EditorDataType>({
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
        width: 100,
        height: 100,
        left: 100,
        top: 100,
        text: 'div1',
        style: { backgroundColor: '#fff2cc', border: '2px solid #d6b656' }
      },
      {
        id: useId(),
        component: 'div',
        width: 100,
        height: 100,
        left: 300,
        top: 150,
        text: 'div2',
        style: { backgroundColor: '#f8cecc', border: '2px solid #b85450' }
      }
    ]
  })

  const editorRef = useRef<HTMLElement | null>(null)

  const { onEditorContextMenu, onContextmenu } = useActions(data, editorRef)

  const tools: ToolType[] = [
    {
      label: t('examples.export'),
      handler: () => {
        $dialog({
          title: t('examples.export'),
          content: JSON.stringify(data.current),
          confirm(text: string) {
            data.current = JSON.parse(text)
          }
        })
      }
    },
    {
      label: t('examples.import'),
      handler: () => {
        $upload({
          resultType: 'json',
          onChange(text: string) {
            data.current = JSON.parse(text)
          }
        })
      }
    },
    {
      label: t('examples.uploadImage'),
      handler: () => {
        $upload({
          resultType: 'image',
          onChange(e: string) {
            const newElement: ComponentType = {
              id: useId(),
              component: 'img',
              props: {
                src: e,
                width: 160,
                onLoad(e: Event) {
                  const { naturalHeight, naturalWidth } = e.target as any
                  const cur = data.current.elements.find((item) => item.id === newElement.id)!

                  cur.width = naturalWidth
                  cur.height = naturalHeight
                }
              }
            }

            data.current.elements.push(newElement)
          }
        })
      }
    }
  ]

  function onDragstart(item: ComponentType) {
    data.current.elements.forEach((item: ComponentType) => (item.selected = false))
    const current = item
    current.selected = true
  }

  function onChange(dragData: DragData, item: ComponentType) {
    Object.keys(dragData).forEach((key) => {
      item[key as keyof DragData] = dragData[key as keyof DragData]
    })
  }

  return (
    <div class="es-container">
      <div class="es-tools">
        {tools.map((item) => (
          <el-button type="primary" onClick={item.handler}>
            {item.label}
          </el-button>
        ))}
      </div>
      <div ref={editorRef} class="es-editor" onContextMenu={(e) => onEditorContextMenu(e)}>
        {data.current.elements.map((item) => (
          <Drager
            {...item}
            rotatable
            onDragStart={() => onDragstart(item)}
            onChange={(e) => onChange(e, item)}
            onContextMenu={(e) => onContextmenu(e, item)}
            onClick={() => {}}
            onMouseDown={() => {}}
          >
            <component
              is={item.component}
              {...item.props}
              style={{
                ...item.style,
                width: '100%',
                height: '100%'
              }}
            >
              {item.text}
            </component>
          </Drager>
        ))}
        <GridRect />
      </div>
    </div>
  )
}

export default App
