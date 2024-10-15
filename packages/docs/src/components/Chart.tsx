import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

import { useTranslation } from 'react-i18next'
function ChartComponent() {
  const chartRef = useRef(null);
  let chart: echarts.ECharts | null = null;
  const { t } = useTranslation()
  useEffect(() => {
    init();
  }, []);

  const init = () => {
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
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  };

  const resize = () => {
    chart?.resize();
  };

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
  );
}

export default ChartComponent;
