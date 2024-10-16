import React, { useState, useEffect } from 'react'
import { Row, Col, Switch, Slider, Input } from 'antd'
import ColorPicker from './ColorPicker' // 假设 ColorPicker 是一个自定义组件
import { useEditorStore } from '@es-drager/editor/src/store'

const ShadowSettings = () => {
  const store = useEditorStore()
  const [shadow, setShadow] = useState(false)
  const [shadowX, setShadowX] = useState(3)
  const [shadowY, setShadowY] = useState(3)
  const [shadowBlur, setShadowBlur] = useState(1)
  const [shadowColor, setShadowColor] = useState('#808080')

  const boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`

  useEffect(() => {
    if (shadow) {
      store.current.style.boxShadow = boxShadow
    } else {
      store.current.style.boxShadow = undefined
    }
  }, [shadow, shadowX, shadowY, shadowBlur, shadowColor])

  const onChange = () => {
    store.current.style.boxShadow = boxShadow
  }

  return (
    <div>
      {store.current.style && (
        <Row gutter={10}>
          <Col span={10}>开启阴影:</Col>
          <Col span={14}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Switch checked={shadow} onChange={(checked) => setShadow(checked)} />
            </div>
          </Col>
        </Row>
      )}

      {shadow && (
        <>
          <Row gutter={10}>
            <Col span={10}>水平阴影:</Col>
            <Col span={14}>
              <Slider
                value={shadowX}
                onChange={(value) => setShadowX(value)}
                step={1}
                min={-10}
                max={10}
                size="small"
                onAfterChange={onChange}
              />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={10}>垂直阴影:</Col>
            <Col span={14}>
              <Slider
                value={shadowY}
                onChange={(value) => setShadowY(value)}
                step={1}
                min={-10}
                max={10}
                size="small"
                onAfterChange={onChange}
              />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={10}>模糊距离:</Col>
            <Col span={14}>
              <Slider
                value={shadowBlur}
                onChange={(value) => setShadowBlur(value)}
                step={1}
                min={1}
                max={20}
                size="small"
                onAfterChange={onChange}
              />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={10}>阴影颜色:</Col>
            <Col span={14}>
              <ColorPicker value={shadowColor} onChange={(color) => setShadowColor(color)} />
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default ShadowSettings
