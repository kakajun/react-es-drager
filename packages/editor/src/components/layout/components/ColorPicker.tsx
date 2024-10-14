import React, { useState, useMemo } from 'react'
import ColorPicker from './ColorPicker' // 假设 ColorPicker 是一个已存在的组件
import { Slider } from 'antd' // 假设使用 antd 的 Slider 组件

interface Props {
  modelValue?: string
  onUpdateModelValue?: (value: string) => void
}

const GradientColorPicker: React.FC<Props> = ({ modelValue, onUpdateModelValue }) => {
  const [type, setType] = useState(modelValue.includes('gradient') ? 2 : 1)
  const [gradientType, setGradientType] = useState('linear')
  const [startColor, setStartColor] = useState('rgba(255, 255, 255, 1)')
  const [endColor, setEndColor] = useState('rgba(255, 255, 255, 1)')
  const [gradientRotate, setGradientRotate] = useState(90)

  const typeList = [
    { label: '纯色背景', value: 1 },
    { label: '渐变背景', value: 2 }
  ]

  const gradientTypeList = [
    { label: '线性渐变', value: 'linear' },
    { label: '径向渐变', value: 'radial' }
  ]

  const handleTypeChange = (newType: number) => {
    setType(newType)
    if (newType === 1) {
      onUpdateModelValue?.(startColor)
    } else {
      handleGradientColorChange(gradientRotate, startColor, endColor)
    }
  }

  const handleGradientColorChange = (rotate: number, start: string, end: string) => {
    let val = `linear-gradient(${rotate}deg, ${start}, ${end})`
    if (gradientType === 'radial') {
      val = `radial-gradient(${start}, ${end})`
    }

    onUpdateModelValue?.(val)
  }

  const handleGradientTypeChange = (newType: string) => {
    setGradientType(newType)
  }

  const getGradientValue = (type: string) => {
    const gradientString = modelValue || 'rgba(255, 255, 255, 1)'
    const isGradient = gradientString.includes('gradient')

    if (!isGradient) {
      return type === 'startColor' ? startColor : '90'
    }

    let gradientRegex = /gradient\((\d+deg),\s*(rgba?\([^)]+\)),\s*(rgba?\([^)]+\))\)/
    const isRadial = gradientString.includes('radial')
    if (isRadial) {
      gradientRegex = /(gradient)\(.*(rgba?\([^)]+\)),\s*(rgba?\([^)]+\))\)/
    }

    const match = gradientString.match(gradientRegex)
    if (!match) {
      return type === 'startColor' ? startColor : '90'
    }

    if (type === 'startColor') {
      return match[2]
    } else if (type === 'endColor') {
      return match[3]
    } else if (type === 'gradientRotate') {
      return parseInt(match[1])
    }

    return '90'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <select value={type} onChange={(e) => handleTypeChange(parseInt(e.target.value))}>
            {typeList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: '48%' }}>
          {type === 1 ? (
            <ColorPicker
              value={startColor}
              onChange={(color) => setStartColor(color)}
              colorFormat="rgb"
            />
          ) : (
            <select value={gradientType} onChange={(e) => handleGradientTypeChange(e.target.value)}>
              {gradientTypeList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      {type === 2 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div style={{ width: '48%' }}>起点颜色:</div>
            <div style={{ width: '48%' }}>
              <ColorPicker
                value={startColor}
                onChange={(color) => setStartColor(color)}
                colorFormat="rgb"
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div style={{ width: '48%' }}>终点颜色:</div>
            <div style={{ width: '48%' }}>
              <ColorPicker
                value={endColor}
                onChange={(color) => setEndColor(color)}
                colorFormat="rgb"
              />
            </div>
          </div>
          {gradientType === 'linear' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <div style={{ width: '48%' }}>渐变角度:</div>
              <div style={{ width: '48%' }}>
                <Slider
                  value={gradientRotate}
                  onChange={(val) => setGradientRotate(val)}
                  max={360}
                  step={1}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GradientColorPicker
