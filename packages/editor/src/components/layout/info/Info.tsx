import React, { useState, useEffect, useMemo } from 'react'
import { useEditorStore } from '@es-drager/editor/src/store'
import EditorStyle from './EditorStyle'
import ElementStyle from './ElementStyle'
import Position from './Position'
import Animation from './Animation'
import './info.less'
const InfoLayout = () => {
  const store = useEditorStore()
  const [activeName, setActiveName] = useState('画布属性')

  const componentMap = {
    样式: ElementStyle,
    位置: Position,
    动画: Animation,
    画布属性: EditorStyle
  }

  const elementTabs = ['样式', '位置', '动画']
  const editorTabs = ['画布属性']

  const tabs = useMemo(() => {
    if (store.current && store.current.selected) {
      return elementTabs
    }
    return editorTabs
  }, [store.current, store.current.selected])

  const currentComponent = useMemo(() => componentMap[activeName], [activeName])

  useEffect(() => {
    setActiveName(store.current.selected ? elementTabs[0] : editorTabs[0])
  }, [store.current.selected])

  const handleTabClick = (item: string) => {
    setActiveName(item)
  }

  return (
    <div className="es-layout-info">
      <div className="es-info-tabs">
        {tabs.map((item) => (
          <div
            key={item}
            className={['es-info-tab', { active: item === activeName }].join(' ')}
            onClick={() => handleTabClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="es-info-style" onClick={(e) => e.stopPropagation()}>
        {React.createElement(currentComponent)}
      </div>
    </div>
  )
}

export default InfoLayout
