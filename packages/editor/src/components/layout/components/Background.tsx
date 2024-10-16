import React, { useState, useEffect } from 'react'
import ColorPicker from './ColorPicker'
import { Slider } from 'antd'
import color from 'color'

interface BackgroundProps {
  modelValue: string
}
const GradientSettings: React.FC<BackgroundProps> = ({ modelValue }) => {
  const [type, setType] = useState(1)
  const [value, setValue] = useState(modelValue)
  const [gradientType, setGradientType] = useState('linear')
  const [startColor, setStartColor] = useState('rgba(255, 255, 255, 1)')
  const [endColor, setEndColor] = useState('rgba(255, 255, 255, 1)')
  const [gradientRotate, setGradientRotate] = useState(90)

  const defaultValueMap: any = {
    startColor: 'rgba(255, 255, 255, 1)',
    endColor: 'rgba(255, 255, 255, 1)',
    gradientRotate: 90
  }
  const typeList = [
    { label: '纯色背景', value: 1 },
    { label: '渐变背景', value: 2 }
  ]

  const gradientTypeList = [
    { label: '线性渐变', value: 'linear' },
    { label: '径向渐变', value: 'radial' }
  ]

  useEffect(() => {
    if (type === 1) {
      setValue(value)
    } else {
      handleGradientColorChange(gradientRotate, startColor, endColor)
    }
  }, [type])

  useEffect(() => {
    handleGradientColorChange(gradientRotate, startColor, endColor)
  }, [gradientType, startColor, endColor, gradientRotate])

  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const handleGradientColorChange = (
    rotate: string | number,
    startColor: string | number,
    endColor: string | number
  ) => {
    let val = `linear-gradient(${rotate}deg, ${startColor}, ${endColor})`
    if (gradientType === 'radial') {
      val = `radial-gradient(${startColor}, ${endColor})`
    }

    setValue(val)
  }

  const getGradientValue = (type: string) => {
    const gradientString = value || 'rgba(255, 255, 255, 1)'
    const isGradient = gradientString.includes('gradient')

    if (!isGradient) {
      return type === 'startColor' ? color(gradientString).rgb().string() : defaultValueMap[type]
    }

    let gradientRegex = /gradient\((\d+deg),\s*(rgba?\([^)]+\)),\s*(rgba?\([^)]+\))\)/
    const isRadial = gradientString.includes('radial')
    if (isRadial) {
      gradientRegex = /(gradient)\(.*(rgba?\([^)]+\)),\s*(rgba?\([^)]+\))\)/
    }

    const match = gradientString.match(gradientRegex)
    const defaultValue = defaultValueMap[type]
    if (!match) {
      return defaultValue
    }

    if (type === 'startColor') {
      return match[2] || defaultValue
    } else if (type === 'endColor') {
      return match[3] || defaultValue
    } else if (type === 'gradientRotate') {
      return parseInt(match[1] || defaultValue)
    }

    return defaultValue
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          gap: '10px'
        }}
      >
        <div style={{ flex: 1 }}>
          <select value={type} onChange={handleTypeChange}>
            {typeList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {type === 1 ? (
          <ColorPicker value={value} onChange={(color) => setValue(color)} colorFormat="rgb" />
        ) : (
          <select value={gradientType} onChange={(e) => setGradientType(e.target.value)}>
            {gradientTypeList.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>
      {type === 2 && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              gap: '10px'
            }}
          >
            <div style={{ flex: 1 }}>起点颜色:</div>
            <ColorPicker value={startColor} onChange={(color) => setStartColor(color)} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              gap: '10px'
            }}
          >
            <div style={{ flex: 1 }}>终点颜色:</div>
            <ColorPicker value={endColor} onChange={(color) => setEndColor(color)} />
          </div>
          {gradientType === 'linear' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                gap: '10px'
              }}
            >
              <div style={{ flex: 1 }}>渐变角度:</div>
              <Slider value={gradientRotate} max={360} onChange={(val) => setGradientRotate(val)} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GradientSettings
