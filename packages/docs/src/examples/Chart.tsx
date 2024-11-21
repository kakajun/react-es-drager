import React, { useState, useRef, useEffect } from 'react'
import Drager from 'react-es-drager'
import Chart from '@/components/Chart'

type ChartType = {
  resize: () => void
}

function DragerComponent() {
  const [defaultSize, setDefaultSize] = useState({
    width: 300,
    height: 200,
    left: 100,
    top: 100,
    angle: 0
  })

  const chartRef = useRef<ChartType>(null)

  const handleResize = () => {
    if (chartRef.current) {
      chartRef.current.resize()
    }
  }

  return (
    <>
      <Drager defaultSize={defaultSize} onResize={handleResize} rotatable>
        <Chart ref={chartRef} />
      </Drager>
    </>
  )
}

export default DragerComponent
