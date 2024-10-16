import React, { useState, useEffect, useRef } from 'react'
import { GridRect } from '@es-drager/editor'
import Drager, { DragData, MarklineData } from 'react-es-drager'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

type ComponentType = {
  id?: string
  component: string
  text?: string
  width?: number
  height?: number
  top?: number
  left?: number
  angle?: number
  style?: React.CSSProperties
}

interface EditorState {
  componentList: ComponentType[]
}

function App() {
  const [markLineData, setMarkLineData] = useState<MarklineData>({ left: null, top: null })
  const { t } = useTranslation()
  const [data, setData] = useState<EditorState>({
    componentList: [
      {
        id: 'div1',
        component: 'div',
        text: 'div1',
        width: 100,
        height: 100,
        left: 0,
        top: 0
      },
      {
        id: 'div2',
        component: 'div',
        text: 'div2',
        width: 100,
        height: 100,
        top: 100,
        left: 100
      }
    ]
  })

  const command = useCommand(setData, data)

  function onDragend() {
    command.record()
  }

  function onChange(dragData: DragData, item: ComponentType) {
    Object.keys(dragData).forEach((key) => {
      ;(item as any)[key] = dragData[key as keyof DragData]
    })
  }

  function useCommand(
    setData: React.Dispatch<React.SetStateAction<EditorState>>,
    data: EditorState
  ) {
    const queue: ComponentType[] = []
    let current = -1

    const redo = () => {
      if (current < queue.length - 1) {
        current++
        setData({ ...data, componentList: deepCopy(queue[current]) })
      }
    }

    const undo = () => {
      if (current >= 0) {
        current--
        if (queue[current]) {
          setData({ ...data, componentList: deepCopy(queue[current]) })
        }
      }
    }

    const record = () => {
      queue[++current] = deepCopy(data.componentList)
    }

    record()

    const onKeydown = (e: KeyboardEvent) => {
      const { ctrlKey, key } = e
      if (ctrlKey) {
        if (key === 'z') undo()
        else if (key === 'y') redo()
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', onKeydown)
      return () => {
        window.removeEventListener('keydown', onKeydown)
      }
    }, [])

    return {
      redo,
      undo,
      record
    }
  }

  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  }

  function onMarkline(data: MarklineData) {
    setMarkLineData(data)
  }

  return (
    <div className="es-container">
      <div className="es-tools">
        <Button type="primary" onClick={() => command.undo()}>
          {t('examples.undo')}
        </Button>
        <Button type="primary" onClick={() => command.redo()}>
          {t('examples.redo')}
        </Button>
      </div>
      <div className="es-editor">
        {data.componentList.map((item) => (
          <Drager
            key={item.id}
            {...item}
            snap
            snapThreshold={10}
            markline
            onChange={(e) => onChange(e, item)}
            onDragEnd={() => onDragend()}
          >
            <div>{item.text}</div>
          </Drager>
        ))}

        <Drager width={100} height={100} left={200} top={200} snap markline={onMarkline}>
          custom markline
        </Drager>

        {markLineData.left !== null && (
          <div className="es-editor-markline-left" style={{ left: `${markLineData.left}px` }}></div>
        )}
        {markLineData.top !== null && (
          <div className="es-editor-markline-top" style={{ top: `${markLineData.top}px` }}></div>
        )}
        <GridRect className="grid-rect" />
      </div>
    </div>
  )
}

export default App
