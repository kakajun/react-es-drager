import React, { useEffect, useRef, useState } from 'react'
import Aside from './Aside'
import Info from './info/Info'
import Editor from '../editor/index'
import Preview from '../common/Preview'
import { useEditorStore } from '../../store'
import { useCommand } from '../../hooks/useCommand'
import { useId } from '../../utils/common'
import { RefreshLeft, RefreshRight, Upload, Download, Picture, View } from '@element-plus/icons-vue'

const App = ({ data, theme }) => {
  const [store, setStore] = useState(() => useEditorStore())
  const mainRef = useRef(null)
  const { commands } = useCommand(store)
  const tools = [
    { label: '撤销', icon: RefreshLeft, handler: commands.undo },
    { label: '重做', icon: RefreshRight, handler: commands.redo },
    {
      label: '导出',
      icon: Download,
      handler: () => {
        alert(JSON.stringify(store.data)) // 示例替换为实际导出逻辑
      }
    },
    {
      label: '导入',
      icon: Upload,
      handler: () => {
        // 示例替换为实际导入逻辑
      }
    },
    {
      label: '插入图片',
      icon: Picture,
      handler: () => {
        // 示例替换为实际图片上传逻辑
      }
    },
    { label: '预览', icon: View, handler: () => setStore({ ...store, preview: true }) }
  ]

  const editorContainerStyle = {
    position: 'relative',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%'
  }

  const mainRect = mainRef.current?.getBoundingClientRect()

  let currentComponent = null

  const handleAsideDragstart = (component) => {
    currentComponent = component
  }

  const handleAsideDragend = () => {
    currentComponent = null
  }

  const dragenter = (e) => {
    e.dataTransfer.dropEffect = 'move'
  }

  const drop = (e) => {
    if (!currentComponent) return
    const elements = [
      ...store.data.elements,
      {
        ...currentComponent,
        id: useId(),
        left: e.clientX - currentComponent.width / 2,
        top: e.clientY - currentComponent.height / 2,
        style: currentComponent.style || {}
      }
    ]
    setStore({ ...store, data: { ...store.data, elements } })
    currentComponent = null
  }

  useEffect(() => {
    setStore({
      ...store,
      initWidth: Math.floor(mainRect.width),
      initHeight: Math.floor(mainRect.height - 7)
    })
    setStore({
      ...store,
      data: {
        ...store.data,
        container: {
          ...store.data.container,
          style: { ...store.data.container.style, width: store.initWidth, height: store.initHeight }
        }
      }
    })
  }, [])

  useEffect(() => {
    setStore({ ...store, data })
  }, [data])

  useEffect(() => {
    if (theme) {
      setStore({ ...store, theme })
    }
  }, [theme])

  const getData = () => ({ ...store.data })

  return (
    <div className="es-layout-container" onDrop={drop} onDragOver={(e) => e.preventDefault()}>
      <Aside onDragStart={handleAsideDragstart} onDragEnd={handleAsideDragend} />
      <div ref={mainRef} className="es-layout-main">
        <div className="es-editor-container" style={editorContainerStyle}>
          <Editor value={store.data} commands={commands} onDragEnter={dragenter} onDrop={drop} />
        </div>
      </div>
      <Info value={store.current} />
      <Preview value={store.preview} />
    </div>
  )
}

export default App
