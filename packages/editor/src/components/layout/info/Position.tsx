import React, { useState, useEffect, useMemo } from 'react'
import { Form, Row, Col, InputNumber, Tooltip, Button, Divider, Checkbox, Flex } from 'antd'
import { useEditorStore } from '@es-drager/editor/src/store'
import InputNumberComponent from '../components/InputNumber'
import SvgIcon from '../components/svgIcon/SvgIcon'
import './Position.less'

const PositionForm = () => {
  const store = useEditorStore()
  const [active, setActive] = useState(store.current && store.current.selected)
  const [options1Value, setOptions1Value] = useState(['resizable', 'rotatable'])

  // 水平对齐
  const alignX = useMemo(
    () => [
      { label: '左对齐', value: 'justify-left' },
      { label: '水平居中', value: 'justify-center' },
      { label: '右对齐', value: 'justify-right' }
    ],
    []
  )

  // 垂直对齐
  const alignY = useMemo(
    () => [
      { label: '上对齐', value: 'align-top' },
      { label: '垂直居中', value: 'align-center' },
      { label: '下对齐', value: 'align-bottom' }
    ],
    []
  )

  const options1 = useMemo(
    () => [
      { label: '禁用', value: 'disabled' },
      { label: '可缩放', value: 'resizable' },
      { label: '可旋转', value: 'rotatable' }
    ],
    []
  )

  const handleUpdateAngle = (num: number) => {
    store.current.angle = (store.current.angle || 0) + num
  }

  const handleOptions1Change = (val: string[]) => {
    const keys = options1.map((item) => item.value)
    keys.forEach((key) => {
      if (val.includes(key)) {
        ;(store.current as any)[key] = true
      } else {
        ;(store.current as any)[key] = false
      }
    })
  }

  const handleAlign = (type: string) => {
    const { width, height } = store.data.container.style as any
    switch (type) {
      case 'justify-left':
        store.current.left = 0
        break
      case 'justify-center':
        store.current.left = width / 2 - store.current.width! / 2
        break
      case 'justify-right':
        store.current.left = width - store.current.width!
        break
      case 'align-top':
        store.current.top = 0
        break
      case 'align-center':
        store.current.top = height / 2 - store.current.height! / 2
        break
      case 'align-bottom':
        store.current.top = height - store.current.height!
        break
    }
  }

  useEffect(() => {
    setActive(!!(store.current && store.current.selected))
  }, [store.current, store.current.selected])

  return (
    <Form
      model={store.current}
      labelWidth="80px"
      labelPosition="left"
      style={{ display: active ? 'block' : 'none' }}
    >
      <Row gutter={10}>
        <Col span={12}>
          <InputNumber value={store.current.left} prefix="X" />
        </Col>
        <Col span={12}>
          <InputNumber value={store.current.top} prefix="Y" />
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={12}>
          <InputNumber value={store.current.width} prefix="W" />
        </Col>
        <Col span={12}>
          <InputNumber value={store.current.height} prefix="H" />
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={12}>
          <InputNumber value={store.current.angle} prefix="旋转" />
        </Col>
        <Col span={12} className="es-col">
          <div className="text-btn" onClick={() => handleUpdateAngle(-45)}>
            <SvgIcon name="rotate-left" /> -45°
          </div>
          <div className="text-btn" onClick={() => handleUpdateAngle(45)}>
            <SvgIcon name="rotate-right" /> +45°
          </div>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Flex gap="small" vertical>
          {alignX.map((item) => (
            <Tooltip placement="top" showAfter={300} content={item.label}>
              <Button style={{ flex: 1 }} onClick={() => handleAlign(item.value)}>
                <SvgIcon name={item.value} size={20} />
              </Button>
            </Tooltip>
          ))}
        </Flex>
      </Row>

      <Row>
        <Flex gap="small" vertical>
          {alignY.map((item) => (
            <Tooltip placement="top" showAfter={300} content={item.label}>
              <Button style={{ flex: 1 }} onClick={() => handleAlign(item.value)}>
                <SvgIcon name={item.value} size={20} />
              </Button>
            </Tooltip>
          ))}
        </Flex>
      </Row>

      <Divider />

      <Row>
        <Checkbox.Group value={options1Value} size="small" onChange={handleOptions1Change}>
          {options1.map((item) => (
            <Tooltip placement="top" showAfter={300} content={item.label}>
              <Checkbox style={{ flex: 1 }} value={item.value}>
                <SvgIcon name={item.value} size={20} />
              </Checkbox>
            </Tooltip>
          ))}
        </Checkbox.Group>
      </Row>
    </Form>
  )
}

export default PositionForm
