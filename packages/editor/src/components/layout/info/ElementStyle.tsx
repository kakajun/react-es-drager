import React, { useState, useEffect, useMemo } from 'react'
import { Form, Divider, Row, Col, Slider } from 'antd'
import TextStyle from './TextStyle'
import { useEditorStore } from '@es-drager/editor/src/store'
import Background from '../components/Background'
import Border from '../components/Border'
import Shadow from '../components/Shadow'
import './ElementStyle.less'
const ColorList = ({ styles }) => (
  <div className="color-list">
    {styles.map((style: React.CSSProperties | undefined, index: React.Key | null | undefined) => (
      <div
        key={index}
        className="color-item"
        style={style}
        onClick={() => handleColorClick(style)}
      />
    ))}
  </div>
)

const Component = () => {
  const [itemList, setItemList] = useState([
    { backgroundColor: '#ff4500' },
    { backgroundColor: '#ff8c00' },
    { backgroundColor: '#ffd700' },
    { backgroundColor: '#90ee90' },
    { backgroundColor: '#00ced1' },
    { backgroundColor: '#1e90ff' },
    { backgroundColor: '#c71585' },
    { backgroundColor: 'rgba(255, 69, 0, 0.68)' }
  ])

  const store = useEditorStore()
  const current = store.current

  const elementBg = useMemo(
    () => ({
      get: () => current?.style?.background || current?.style?.backgroundColor,
      set: (val: string) => {
        if (current?.style) {
          current.style.background = val
        }
      }
    }),
    [current]
  )

  const handleColorClick = (style) => {
    if (!current?.selected) return
    if (current?.style) {
      current.style = { ...current.style, ...style }
    }
  }

  const onChange = (key, value) => {
    if (current?.style) {
      current.style[key] = value
    }
  }

  return (
    <Form
      model={current}
      labelWidth="80px"
      labelPosition="left"
      style={{ display: current?.selected ? 'block' : 'none' }}
    >
      <ColorList styles={itemList} />

      <Divider />

      {current?.style && (
        <>
          <Background value={elementBg} onChange={(val) => elementBg.set(val)} />
          <Divider />

          <Row gutter={10}>
            <Col span={10}>透明度:</Col>
            <Col span={14}>
              <Slider
                value={1}
                step={0.01}
                min={0}
                max={1}
                size="small"
                onChange={(value) => onChange('opacity', value)}
              />
            </Col>
          </Row>

          <Divider />
          <TextStyle />
          <Divider />
          <Border />
          <Divider />
          <Shadow />
        </>
      )}
    </Form>
  )
}

export default Component
