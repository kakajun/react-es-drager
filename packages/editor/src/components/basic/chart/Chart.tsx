import React, { useRef, useEffect, useLayoutEffect } from 'react'
import * as echarts from 'echarts'
import { useTranslation } from 'react-i18next'
import { ComponentType } from '@es-drager/editor'

interface Props {
  element: ComponentType
  option: any
}

const ChartComponent: React.FC<Props> = ({ element, option }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  let chart: echarts.ECharts | null = null
  const { t } = useTranslation()

  function init() {
    chart = echarts.init(chartRef.current)
    // 绘制图表
    chart.setOption({
      title: {
        text: t('examples.chartTitle')
      },
      tooltip: {},
      xAxis: {
        data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6']
      },
      yAxis: {},
      series: [
        {
          name: 'Sales',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    })
  }

  useEffect(() => {
    init()
  }, [])

  useLayoutEffect(() => {
    chart?.resize()
  }, [element.width, element.height])

  useEffect(() => {
    chart?.setOption(option)
  }, [option])

  const resize = () => {
    chart?.resize()
  }

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}

export default ChartComponent
