import { useState, useEffect, useRef } from 'react'
import { DragerProps, MarklineData } from '../drager'
type MarklineEvent = 'drag-start' | 'drag' | 'drag-end'

const isFn = (value: any): value is Function => typeof value === 'function'

export function useMarkline(
  targetRef: React.MutableRefObject<HTMLElement | null>,
  props: DragerProps
) {
  const [lineX, setLineX] = useState<HTMLElement | null>(null)
  const [lineY, setLineY] = useState<HTMLElement | null>(null)
  const parentRef = useRef<HTMLElement | null>(null)
  const parentRectRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (targetRef.current) {
      parentRef.current = targetRef.current.offsetParent || document.body
      parentRectRef.current = getBoundingClientRectByScale(parentRef.current, props.scaleRatio)
    }
  }, [targetRef, props.scaleRatio])

  const lines = useRef<{
    x: Array<{ top: number; showTop: number }> | null
    y: Array<{ left: number; showLeft: number }> | null
  }>({
    x: null,
    y: null
  })

  const init = () => {
    if (props.markline && !isFn(props.markline)) {
      if (!lineX) {
        lineX =
          document.querySelector<HTMLElement>('.es-drager-markline-x') ||
          initLine('x', parentRef.current!, props.color)
        setLineX(lineX)
      }

      if (!lineY) {
        lineY =
          document.querySelector<HTMLElement>('.es-drager-markline-y') ||
          initLine('y', parentRef.current!, props.color)
        setLineY(lineY)
      }
    }
  }

  const update = (marklineData: MarklineData = {}) => {
    if (!props.markline) return

    if (isFn(props.markline)) {
      return props.markline(marklineData)
    }

    if (marklineData.left === null) {
      if (lineX) lineX.style.display = 'none'
    } else {
      if (lineX) {
        lineX.style.left = `${marklineData.left}px`
        lineX.style.backgroundColor = props.color
        lineX.style.display = 'block'
      }
    }

    if (marklineData.top === null) {
      if (lineY) lineY.style.display = 'none'
    } else {
      if (lineY) {
        lineY.style.top = `${marklineData.top}px`
        lineY.style.backgroundColor = props.color
        lineY.style.display = 'block'
      }
    }
  }

  const handleDragStart = () => {
    const source = getBoundingClientRectByScale(targetRef.current!, props.scaleRatio)
    const elList = document.querySelectorAll('.es-drager')
    const targets = []

    for (let i = 0; i < elList.length; i++) {
      const el = elList[i] as HTMLElement
      if (el !== targetRef.current) {
        targets.push(getBoundingClientRectByScale(el, props.scaleRatio))
      }
    }

    lines.current = calcLines(targets, source)
  }

  const handleDrag = () => {
    const markLine: MarklineData = {
      top: null,
      left: null,
      diffX: 0,
      diffY: 0
    }

    const source = getBoundingClientRectByScale(targetRef.current!, props.scaleRatio)
    const snapThreshold = props.snapThreshold ?? 10
    if (lines.current?.y) {
      for (let i = 0; i < lines.current.y.length; i++) {
        const { top, showTop } = lines.current.y[i]

        if (Math.abs(top - source.top) < snapThreshold) {
          markLine.diffY = top - source.top
          markLine.top = showTop - (parentRectRef.current?.top ?? 0)
          break
        }
      }
    }

    if (lines.current?.x) {
      for (let i = 0; i < lines.current.x.length; i++) {
        const { left, showLeft } = lines.current.x[i]

        if (Math.abs(left - source.left) < snapThreshold) {
          markLine.diffX = left - source.left
          markLine.left = showLeft - (parentRectRef.current?.left ?? 0)
          break
        }
      }
    }

    update(markLine)
    return markLine
  }

  const handleDragEnd = () => {
    update({ left: null, top: null })
  }

  const marklineEmit = (type: MarklineEvent) => {
    if (!props.snap && !props.markline) return

    switch (type) {
      case 'drag-start':
        handleDragStart()
        break
      case 'drag':
        handleDrag()
        break
      case 'drag-end':
        handleDragEnd()
        break
      default:
        break
    }
  }

  useEffect(() => {
    init()
  }, [props.markline, props.color])

  return {
    marklineEmit
  }
}

function initLine(dir: 'x' | 'y' = 'x', parent: Element, color = '') {
  const line = document.createElement('div')
  line.classList.add(`es-drager-markline-${dir}`)
  // common style
  line.style.position = 'absolute'
  line.style.top = '0px'
  line.style.left = '0px'
  line.style.zIndex = '9999'
  line.style.backgroundColor = color
  line.style.display = 'none'

  if (dir === 'x') {
    line.style.height = '100%'
    line.style.width = '1px'
  } else {
    line.style.height = '1px'
    line.style.width = '100%'
  }

  parent.appendChild(line)
  return line
}

// 计算辅助线
function calcLines(list: DOMRect[], current: DOMRect) {
  const lines: any = { x: [], y: [] }
  const { width = 0, height = 0 } = current

  list.forEach((block) => {
    const { top: ATop, left: ALeft, width: AWidth, height: AHeight } = block

    lines.y.push({ showTop: ATop, top: ATop }) // 顶对顶
    lines.y.push({ showTop: ATop, top: ATop - height }) // 顶对底

    lines.y.push({
      showTop: ATop + AHeight / 2,
      top: ATop + AHeight / 2 - height / 2
    }) // 中

    lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight }) // 底对顶

    lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight - height }) // 底对底

    lines.x.push({ showLeft: ALeft, left: ALeft }) // 左对左
    lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth }) // 右对左
    // 中间对中间
    lines.x.push({
      showLeft: ALeft + AWidth / 2,
      left: ALeft + AWidth / 2 - width / 2
    }) // 中
    lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth - width }) // 右对左
    lines.x.push({ showLeft: ALeft, left: ALeft - width }) // 左对右
  })

  return lines
}
