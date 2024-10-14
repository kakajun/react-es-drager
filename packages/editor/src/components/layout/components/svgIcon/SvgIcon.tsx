import React, { useMemo } from 'react'
import { getIcon } from './svg-icon'
import './SvgIcon.less'

interface IconProps {
  name: string
  size?: string | number
  color?: string
}

const EsIcon: React.FC<IconProps> = ({ name, size, color }) => {
  const icon = useMemo(() => getIcon(name), [name])
  const style = useMemo<CSSProperties>(() => {
    if (!size && !color) return {}

    return {
      fontSize: typeof size === 'string' ? size : `${size}px`,
      '--color': color
    }
  }, [size, color])

  return <i className="es-icon" style={style} dangerouslySetInnerHTML={{ __html: icon }} />
}

export default EsIcon
