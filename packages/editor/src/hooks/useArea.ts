import { ComponentType, EditorDataType } from '../types'

import React, { useState, useEffect, useRef } from 'react'

export function useArea(
  data: EditorDataType,
  areaRef: any,
  setData: React.Dispatch<React.SetStateAction<EditorDataType>>
) {
  const [areaSelected, setAreaSelected] = useState(false)

  function onEditorMouseDown(e: React.MouseEvent) {
    let flag = false
    data.elements.forEach((item: ComponentType) => {
      if (item.selected) {
        item.selected = false
        flag = true
      }
    })

    if (!flag) {
      areaRef.current?.handleMouseDown(e)
    }
  }

  function onAreaMove(areaData: { left: number; top: number; width: number; height: number }) {
    const updatedElements = data.elements.map((item) => {
      const containLeft =
        areaData.left < item.left && areaData.left + areaData.width > item.left + item.width
      const containTop =
        areaData.top < item.top && areaData.top + areaData.height > item.top + item.height

      return {
        ...item,
        selected: containLeft && containTop
      }
    })
    console.log(updatedElements, '55555')

    setData((prevData) => ({
      ...prevData,
      elements: updatedElements
    }))
  }

  function onAreaUp() {
    setAreaSelected(data.elements.some((item: ComponentType) => item.selected))

    if (areaSelected) {
      setTimeout(() => {
        document.addEventListener(
          'click',
          () => {
            setAreaSelected(false)
          },
          { once: true }
        )
      })
    }
  }

  return {
    areaSelected,
    onEditorMouseDown,
    onAreaMove,
    onAreaUp
  }
}
