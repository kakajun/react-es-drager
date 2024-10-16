import React, { useMemo } from 'react'
import { IconProps, getIcon } from './svg-icon'
import './SvgIcon.less'
const EsIcon: React.FC<IconProps> = ({ name, size, color }) => {
  const icon = useMemo(() => getIcon(name), [name])
  const style = useMemo<React.CSSProperties>(() => {
    if (!size && !color) return {}

    return {
      fontSize: typeof size === 'string' ? size : `${size}px`,
      '--color': color
    }
  }, [size, color])

  return <i className="es-icon" style={style} dangerouslySetInnerHTML={{ __html: icon }} />
}

export default EsIcon
