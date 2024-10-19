import React, { useState, useEffect, useRef } from 'react'
import { GridRect } from '@es-drager/editor'
import Drager, { type DragData, MarklineData } from 'react-es-drager'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import './markline.less'

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
  const [history, setHistory] = React.useState<EditorState | never[]>([])
  const [redoStack, setRedoStack] = React.useState<EditorState | never[]>([])

  function onDragend() {
    const copyData = deepCopy(data)
    // setData(copyData)
    setHistory([...history, copyData])
    if (history.length > 20) {
      history.shift()
    }
  }

  const undoAction = () => {
    if (history.length > 0) {
      const previousContent = history.pop()
      setData(previousContent)
      setRedoStack([...redoStack, data])
    }
  }

  const redoAction = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack.pop()
      setData(nextContent)
      setHistory([...history, data])
    }
  }

  const canUndo = history.length > 0
  const canRedo = redoStack.length > 0

  const onChange = (dragData: DragData, item: ComponentType) => {
    Object.keys(dragData).forEach((key) => {
      ;(item as any)[key] = dragData[key as keyof DragData]
    })
  }

  // const onChange = (dragData: DragData, item: ComponentType) => {
  //   // const newComponentList = data.componentList.map((comp) => {
  //   //   if (comp.id === item.id) {
  //   //     return { ...comp, ...dragData }
  //   //   }
  //   //   return comp
  //   // })
  //   // let newArr = [...newComponentList]
  //   // if (
  //   //   JSON.parse(JSON.stringify(newComponentList)) != JSON.parse(JSON.stringify(data.componentList))
  //   // ) {
  //   //   console.log(newArr, 'newArr')
  //   //   console.log(data.componentList, 'data.componentList')
  //   //   // setData((prevData) => {
  //   //   //   const newComponentList = prevData.componentList.map((comp) => {
  //   //   //     if (comp.id === item.id) {
  //   //   //       return { ...comp, ...dragData }
  //   //   //     }
  //   //   //     return comp
  //   //   //   })
  //   //   //   return { ...prevData, componentList: newComponentList }
  //   //   // })
  //   // }
  // }

  const handleKeydown = (e: KeyboardEvent) => {
    const { ctrlKey, key } = e
    if (ctrlKey) {
      if (key === 'z') undoAction()
      else if (key === 'y') redoAction()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [undoAction, redoAction])

  function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  }

  function onMarkline(data: MarklineData) {
    setMarkLineData(data)
  }

  return (
    <div className="es-container">
      <div className="es-tools">
        <Button
          style={{ marginRight: '10px' }}
          type="primary"
          onClick={undoAction}
          disabled={!canUndo}
        >
          {t('examples.undo')}
        </Button>
        <Button type="primary" onClick={redoAction} disabled={!canRedo}>
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
            onChange={(e: DragData) => onChange(e, item)}
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
