import React, { useState, useRef, useEffect } from 'react'
import { registerConfig as config } from '../../utils/editor-config'
import { ComponentType } from '../../types'
import Icon from '../common/svgIcon/Icon'
import './Aside.less'

const EsLayoutAside: React.FC = () => {
  const [activeNames, setActiveNames] = useState(['1', '2', '3'])
  const dragDataRef = useRef<ComponentType | null>(null)

  const handleDragStart = (e: React.DragEvent, component: ComponentType) => {
    let width = 50
    let height = 50
    if (component.component !== 'es-icon') {
      const target = e.target as HTMLElement
      width = component.width || target.offsetWidth
      height = component.height || target.offsetHeight
    }
    dragDataRef.current = { ...component, width, height }
    e.dataTransfer.setData('text/plain', JSON.stringify(dragDataRef.current))
  }

  const handleDragEnd = () => {
    dragDataRef.current = null
  }

  return (
    <div className="es-layout-aside">
      <div className="el-collapse" data-v-model={activeNames}>
        <div className="el-collapse-item" title="通用" name="1">
          <div className="collapse-content">
            {config.componentList.map((item) => (
              <div
                key={item.text}
                className="es-block"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <Icon name={item.text} />
                <span className="block-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="el-collapse-item" title="图标" name="2">
          <div className="collapse-content">
            {config.iconList.map((item) => (
              <div
                key={item.props.icon}
                className="es-block"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                {item.component ? (
                  <item.component {...item.props} />
                ) : (
                  <span>{item.props.icon}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="el-collapse-item" title="表单控件" name="3">
          <div className="collapse-content">
            {config.formList.map((item) => (
              <div
                key={item.text}
                className="es-block"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <span className="block-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="el-collapse-item" title="数据展示" name="4">
          <div className="collapse-content">
            {config.dataList.map((item) => (
              <div
                key={item.text}
                className="es-block"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <span className="block-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="el-collapse-item" title="其他" name="5">
          <div className="collapse-content">
            {config.otherList.map((item) => (
              <div
                key={item.text}
                className="es-block"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
              >
                <span className="block-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EsLayoutAside
