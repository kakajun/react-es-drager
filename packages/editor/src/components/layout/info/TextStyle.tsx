import React, { useState, useEffect, useMemo } from 'react'
import { Row, Tooltip, Button, Divider, Select, Input, InputNumber, Col } from 'antd'
import ColorPicker from '../components/ColorPicker'
import InputNumberComponent from '../components/InputNumber'
import SvgIcon from '../components/svgIcon/SvgIcon'
import { useEditorStore } from '@es-drager/editor/src/store'
import './TextStyle.less'
const FontStyleSettings = () => {
  const store = useEditorStore()

  const [titleValue, setTitleValue] = useState('')
  const [textStyle, setTextStyle] = useState({})
  const [fontStyleList, setFontStyleList] = useState([])

  const titles = useMemo(
    () => [
      { label: '正常', value: 'normal' },
      { label: '标题 1', value: '2em' },
      { label: '标题 2', value: '1.5em' },
      { label: '标题 3', value: '1.17em' },
      { label: '标题 4', value: '1em' },
      { label: '标题 5', value: '0.9em' },
      { label: '标题 6', value: '0.8em' }
    ],
    []
  )

  const defaultList = useMemo(
    () => [
      { label: '加粗', icon: 'B', key: 'fontWeight', value: 'bold' },
      { label: '斜体', icon: 'I', key: 'fontStyle', value: 'italic' },
      { label: '下划线', icon: 'U', key: 'textDecoration', value: 'underline' },
      { label: '中划线', icon: 'S', key: 'textDecoration', value: 'line-through' },

      { label: '左对齐', icon: 'left', key: 'justifyContent', value: 'flex-start' },
      { label: '水平居中', icon: 'center', key: 'justifyContent', value: 'center' },
      { label: '右对齐', icon: 'right', key: 'justifyContent', value: 'flex-end' },

      { label: '上对齐', icon: 'top', key: 'alignItems', value: 'flex-start' },
      { label: '垂直居中', icon: 'middle', key: 'alignItems', value: 'center' },
      { label: '下对齐', icon: 'bottom', key: 'alignItems', value: 'flex-end' }
    ],
    []
  )

  const fontStyleListFormat = useMemo(() => {
    const formattedList = [
      defaultList.slice(0, 4),
      defaultList.slice(4, 7),
      defaultList.slice(7, 10)
    ]
    return formattedList.map((block) =>
      block.map((item) => ({
        ...item,
        selected: getValue(item.key) === item.value
      }))
    )
  }, [defaultList])

  const fontFamilyList = useMemo(
    () => [
      { label: 'Helvetica' },
      { label: 'PingFang SC' },
      { label: 'Hiragino Sans GB' },
      { label: 'Microsoft YaHei' },
      { label: 'Times New Roman' },
      { label: 'Verdana' },
      { label: 'Courier New' },
      { label: 'Georgia' },
      { label: 'Lucida Sans' },
      { label: 'Tahoma' }
    ],
    []
  )

  useEffect(() => {
    setTitleValue(store.current.style?.fontWeight === 'bold' ? 'normal' : '')
    setTextStyle(store.current.style || {})
    setFontStyleList(fontStyleListFormat)
  }, [store.current.style, fontStyleListFormat])

  const handleFontStyleClick = (item) => {
    const updatedItem = { ...item, selected: !item.selected }
    setStyle(updatedItem.key, updatedItem.selected ? updatedItem.value : undefined)
  }

  const handleTitleChange = (val) => {
    const normal = val === 'normal'
    store.current.style!.fontSize = normal ? undefined : val
    store.current.style!.fontWeight = normal ? 'normal' : 'bold'
  }

  const setStyle = (key, value) => {
    store.current.style = store.current.style || {}
    ;(store.current.style as any)[key] = value
    setTextStyle({ ...textStyle, [key]: value })
  }

  const getValue = (key) => {
    return store.current.style![key]
  }

  return (
    <div>
      {fontStyleListFormat.map((block, index) => (
        <Row key={index}>
          <Button.Group>
            {block.map((item) => (
              <Tooltip placement="top" showAfter={300} content={item.label}>
                <Button
                  type={item.selected ? 'primary' : ''}
                  style={{ flex: 1, ...(index === 0 ? { [item.key]: item.value } : {}) }}
                  onClick={() => handleFontStyleClick(item)}
                >
                  {index === 0 ? item.icon : <SvgIcon name={item.icon} size={20} />}
                </Button>
              </Tooltip>
            ))}
          </Button.Group>
        </Row>
      ))}

      <Divider />

      <Row gutter={10}>
        <Col span={10}>字体颜色:</Col>
        <Col span={14}>
          <ColorPicker vModel={textStyle.color} />
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={10}>标题:</Col>
        <Col span={14}>
          <Select vModel={titleValue} placeholder="标题" onChange={handleTitleChange}>
            {titles.map((item) => (
              <Select.Option label={item.label} value={item.value}>
                <span style={{ fontSize: item.value, fontWeight: 'bold' }}>{item.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={10}>字体:</Col>
        <Col span={14}>
          <Select vModel={textStyle.fontFamily} placeholder="字体">
            {fontFamilyList.map((item) => (
              <Select.Option label={item.label} value={item.label}>
                <span style={{ fontFamily: item.label }}>{item.label}</span>
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={10}>字体大小:</Col>
        <Col span={14}>
          <Input vModel={textStyle.fontSize} />
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={10}>行高:</Col>
        <Col span={14}>
          <InputNumber vModel={textStyle.lineHeight} />
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={10}>文本:</Col>
        <Col span={14}>
          <Input type="textarea" vModel={store.current.text} />
        </Col>
      </Row>
    </div>
  )
}

export default FontStyleSettings
