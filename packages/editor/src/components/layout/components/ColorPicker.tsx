import React, { useEffect, useState } from 'react'
import { ColorPicker } from 'antd'


const ColorPickerComponent = () => {
  const [popperClassName, setPopperClassName] = useState('')

  useEffect(() => {
    setPopperClassName(Math.random().toString(36).substr(2, 9)) // 生成一个随机的类名
  }, [])

  useEffect(() => {
    const popper = document.querySelector(`.${popperClassName}`)
    if (popper) {
      popper.addEventListener('click', (e) => e.stopPropagation()) // 阻止popper点击事件冒泡
      return () => {
        popper.removeEventListener('click', (e) => e.stopPropagation())
      }
    }
  }, [popperClassName])

  const predefineColors = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577'
  ]

  return <ColorPicker className={popperClassName} showAlpha predefine={predefineColors} />
}

export default ColorPickerComponent
