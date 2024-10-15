import { ComponentType, EditorDataType } from '@es-drager/editor'
import { calcLines } from '@es-drager/editor/src/utils'
import { DragData } from 'react-es-drager'
import React, { useState, useEffect, useRef } from 'react'

export function useMarkline(data: EditorDataType, current: ComponentType | null) {
  const markLine = {
    left: null,
    top: null
  }

  const lines = useState<{ x: any[]; y: any[] }>(() => ({
    x: [],
    y: []
  }))

  const updateLines = () => {
    lines.set(calcLines(data.elements, current))
  }

  const updateMarkline = (dragData: DragData) => {
    markLine.top = null
    markLine.left = null

    for (let i = 0; i < lines.value.y.length; i++) {
      const { top, showTop } = lines.value.y[i]

      if (Math.abs(top - dragData.top) < 5) {
        markLine.top = showTop
        break
      }
    }

    for (let i = 0; i < lines.value.x.length; i++) {
      const { left, showLeft } = lines.value.x[i]

      if (Math.abs(left - dragData.left) < 5) {
        markLine.left = showLeft
        break
      }
    }
  }

  return {
    markLine,
    updateLines,
    updateMarkline
  }
}
