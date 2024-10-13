import React, { useRef } from 'react'
import { getXY, MouseTouchEvent, setupMove } from './utils'
import { DragData } from './drager.ts'
import './rotate.less'

interface RotateProps {
  children: React.ReactNode
  dragData: DragData
  element: HTMLElement | null
  onRotate: (angle: number) => void
  onRotateStart?: (data: DragData) => void
  onRotateEnd: (angle: number) => void
}

const Rotate: React.FC<RotateProps> = ({
  dragData,
  element,
  children,
  onRotate,
  onRotateStart,
  onRotateEnd
}) => {
  const rotateRef = useRef<HTMLDivElement>(null)

  const onRotateMousedown = (e: MouseTouchEvent) => {
    if (!element) {
      console.warn('[es-drager] rotate component needs drag element property')
      return
    }

    e.stopPropagation()
    const { width, height, left, top } = element.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    onRotateStart && onRotateStart(dragData)
    let newAngle = 0
    const onMousemove = (e: MouseTouchEvent) => {
      const { clientX, clientY } = getXY(e)
      const diffX = centerX - clientX
      const diffY = centerY - clientY
      const radians = Math.atan2(diffY, diffX)
      const deg = (radians * 180) / Math.PI - 90
      newAngle = (deg + 360) % 360
      onRotate(newAngle)
    }

    const onMouseup = () => {
      onRotateEnd(newAngle)
    }

    setupMove(onMousemove, onMouseup)
  }

  return (
    <div
      ref={rotateRef}
      className="es-drager-rotate"
      onMouseDown={onRotateMousedown}
      onTouchStart={onRotateMousedown}
    >
      {children || (
        <div className="es-drager-rotate-handle">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default Rotate
