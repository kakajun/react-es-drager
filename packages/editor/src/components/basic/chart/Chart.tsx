import React, { useRef, useEffect, useLayoutEffect } from 'react';
import * as echarts from 'echarts';
import { t } from '@es-drager/common/i18n';
import { ComponentType } from '@es-drager/editor';

interface Props {
  element: ComponentType;
  option: any;
}

const ChartComponent: React.FC<Props> = ({ element, option }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chart: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartInstance && chartRef.current) {
      chart = echarts.init(chartRef.current);
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
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (chartInstance) {
      chart?.resize();
    }
  }, [element.width, element.height]);

  useEffect(() => {
    if (chartInstance) {
      chart?.setOption(option);
    }
  }, [option]);

  const resize = () => {
    chart?.resize();
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default ChartComponent;
