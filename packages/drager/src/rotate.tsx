import React, { useState, useRef, useEffect } from 'react'
import { getXY, MouseTouchEvent, setupMove } from './utils'
import './drager.less'

interface RotateProps {
  modelValue: number
  element: HTMLElement | null
  onUpdateModelValue: (value: number) => void
  onRotate: (angle: number) => void
  onRotateStart: (angle: number) => void
  onRotateEnd: (angle: number) => void
}

const Rotate: React.FC<RotateProps> = ({
  modelValue,
  element,
  onUpdateModelValue,
  onRotate,
  onRotateStart,
  onRotateEnd
}) => {
  const rotateRef = useRef<HTMLElement | null>(null)
  const [angle, setAngle] = useState(modelValue)

  useEffect(() => {
    setAngle(modelValue)
  }, [modelValue])

  const onRotateMousedown = (e: MouseTouchEvent) => {
    if (!element) {
      console.warn('[es-drager] rotate component needs drag element property')
      return
    }

    e.stopPropagation()

    const { width, height, left, top } = element.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    onRotateStart(angle)

    const onMousemove = (e: MouseTouchEvent) => {
      const { clientX, clientY } = getXY(e)
      const diffX = centerX - clientX
      const diffY = centerY - clientY

      const radians = Math.atan2(diffY, diffX)
      const deg = (radians * 180) / Math.PI - 90
      const newAngle = (deg + 360) % 360

      setAngle(newAngle)
      onRotate(newAngle)
    }

    const onMouseup = () => {
      onRotateEnd(angle)
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
      <div className="es-drager-rotate-handle">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
          />
        </svg>
      </div>
    </div>
  )
}

export default Rotate
