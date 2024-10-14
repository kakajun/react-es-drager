import React from 'react'
import './icon.less'
type Props = {
  element: any
  icon: string
}

const ElIconWrapper: React.FC<Props> = ({ element, icon }) => {
  const getStyle = () => {
    if (!element) return {}
    const style: React.CSSProperties = {}
    const { width, height } = element

    if (width && height) {
      style['--font-size'] = `${Math.min(width, height)}px`
    }

    if (element.style?.color) {
      style['--color'] = element.style.color
    }

    return style
  }

  return (
    <i className="es-icon" style={getStyle()}>
      <component is={icon} />
    </i>
  )
}

export default ElIconWrapper
