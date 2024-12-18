import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import './Area.less'

interface AreaData {
  width: number
  height: number
  top: number
  left: number
}
interface EsEditorAreaProps {
  onMove: (data: AreaData) => void
  onUp: (data: AreaData) => void
}

interface EsEditorAreaRef {
  handleMouseDown: (e: React.MouseEvent) => void
  areaData: AreaData
}
const EsEditorArea: React.ForwardRefRenderFunction<EsEditorAreaRef, EsEditorAreaProps> = (
  props,
  ref
) => {
  const [show, setShow] = useState(false)
  const [areaData, setAreaData] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  })

  const areaRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    // 你可以在这里暴露一些方法给父组件调用
    handleMouseDown,
    areaData
  }))

  const areaStyle = {
    width: `${areaData.width}px`,
    height: `${areaData.height}px`,
    top: `${areaData.top}px`,
    left: `${areaData.left}px`
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const { pageX: downX, pageY: downY } = e
    const elRect = (e.target as HTMLElement)!.getBoundingClientRect()
    const offsetX = downX - elRect.left
    const offsetY = downY - elRect.top

    const handleMouseMove = (e: MouseEvent) => {
      const disX = e.pageX - downX
      const disY = e.pageY - downY

      let left = offsetX
      let top = offsetY
      let width = Math.abs(disX)
      let height = Math.abs(disY)

      if (width > 2 || height > 2) {
        setShow(true)
      }

      if (disX < 0) {
        left = offsetX - width
      }

      if (disY < 0) {
        top = offsetY - height
      }

      setAreaData({ width, height, left, top })
      props.onMove({ width, height, left, top })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setShow(false)
      setAreaData({ width: 0, height: 0, top: 0, left: 0 })
      props.onUp({ width: 0, height: 0, top: 0, left: 0 })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={areaRef}
      className="es-editor-area"
      onMouseDown={handleMouseDown}
      style={{ ...areaStyle, display: show ? 'block' : 'none' }}
    />
  )
}

export default forwardRef(EsEditorArea)
