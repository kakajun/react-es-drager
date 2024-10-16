import React, { useMemo } from 'react'
import MColor from 'color'
import { useId } from '../../utils/index'
import { useEditorStore } from '../../store'
import './GridRect.less'

interface GridRectProps {
  grid?: number
  gridCount?: number
  showSmall?: boolean
  smallGridId?: string
  gridId?: string
  borderColor?: string
}
const GridRect: React.FC<GridRectProps> = (props) => {
  const { grid = 10, gridCount = 5, showSmall = true, borderColor } = props
  const { theme } = useEditorStore()
  const smallGridId = useMemo(() => props.smallGridId || useId('smallGrid'), [props.smallGridId])
  const gridId = useMemo(() => props.gridId || useId('grid'), [props.gridId])

  const bigGrid = useMemo(() => grid * gridCount, [grid, gridCount])

  const color = useMemo(() => {
    if (borderColor) {
      return {
        bigGrid: borderColor,
        grid: MColor(props.borderColor).fade(0.5).rgb().string()
      }
    }
    const colors = [
      ['#e4e7ed', '#ebeef5'],
      ['#414243', '#363637']
    ]
    const [bigGridColor, gridColor] = colors[theme === 'light' ? 0 : 1]
    return { bigGrid: bigGridColor, grid: gridColor }
  }, [borderColor, theme])

  const rectStyle = useMemo(() => ({ '--border-color': color.bigGrid }), [color.bigGrid])

  return (
    <div className="grid-rect" style={rectStyle}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {showSmall && (
            <pattern id={smallGridId} width={grid} height={grid} patternUnits="userSpaceOnUse">
              <path
                d={`M ${grid} 0 L 0 0 0 ${grid}`}
                fill="none"
                stroke={color.grid}
                strokeWidth="0.5"
              />
            </pattern>
          )}
          <pattern id={gridId} width={bigGrid} height={bigGrid} patternUnits="userSpaceOnUse">
            {showSmall && <rect width={bigGrid} height={bigGrid} fill={`url(#${smallGridId})`} />}
            <path
              d={`M ${bigGrid} 0 L 0 0 0 ${bigGrid}`}
              fill="none"
              stroke={color.bigGrid}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
    </div>
  )
}

export default GridRect
