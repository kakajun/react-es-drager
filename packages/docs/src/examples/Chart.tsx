import React, { useState, useRef, useEffect } from 'react'
import Drager from 'react-es-drager'
import Chart from '@/components/Chart'

function DragerComponent() {
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(200)
  const [left, setLeft] = useState(100)
  const [top, setTop] = useState(100)
  const chartRef = useRef(null)

  const handleResize = () => {
    chartRef.current.resize()
  }

  return (
    <>
      <Drager width={width} height={height} left={left} top={top} onResize={handleResize} rotatable>
        <Chart ref={chartRef} />
      </Drager>
    </>
  )
}

export default DragerComponent
