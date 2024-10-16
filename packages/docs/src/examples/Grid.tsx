import React, { useState, useEffect } from 'react'
import Drager from 'react-es-drager'
import { GridRect } from '@es-drager/editor'
import './Grid.less'

const MyComponent = () => {
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(50)
  const [scale, setScale] = useState(1)

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(event.target.value))
  }

  const boxStyle = {
    transform: `scale(${scale})`
  }

  return (
    <>
      <div className="es-grid-info">
        <div className="es-info-item">
          <span>snapToGrid</span>
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => setSnapToGrid(e.target.checked)}
          />
        </div>
        <div className="es-info-item">
          <span>gridSize</span>
          <input
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </div>
        <div className="es-info-item">
          <span>scaleRatio</span>
          <input type="number" value={scale} onChange={handleScaleChange} />
        </div>
      </div>
      <div className="es-grid-box" style={boxStyle}>
        <Drager
          width={100}
          height={100}
          top={100}
          left={100}
          gridX={gridSize}
          gridY={gridSize}
          snapToGrid={snapToGrid}
          scaleRatio={scale}
          boundary
        />
        <GridRect showSmall={false} grid={gridSize / 5} />
      </div>
    </>
  )
}

export default MyComponent
