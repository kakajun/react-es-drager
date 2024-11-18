import React, { useState, useRef, useEffect } from 'react'
import Drager from 'react-es-drager'
import Chart from '@/components/Chart'

// 确保 ChartType 与 ChartMethods 一致
type ChartType = {
  resize: () => void
}

function DragerComponent() {
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(200)
  const [left, setLeft] = useState(100)
  const [top, setTop] = useState(100)
  const chartRef = useRef<ChartType>(null) // 确保类型与 ChartMethods 一致

  const handleResize = () => {
    if (chartRef.current) {
      chartRef.current.resize()
    }
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
