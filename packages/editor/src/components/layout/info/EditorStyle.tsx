import React, { useState, useEffect, useMemo } from 'react';
import InputNumber from '../components/InputNumber';
import Background from '../components/Background';
import ColorPicker from '../components/ColorPicker';
import { useEditorStore } from '@es-drager/editor/src/store';

const CanvasSettingsForm = () => {
  const store = useEditorStore();

  // 缩放比例
  const [scaleRatio, setScaleRatio] = useState(100);

  // 画布尺寸
  const [editorSize, setEditorSize] = useState(`${store.data.container.style.width} x ${store.data.container.style.height}`);

  // 画布背景
  const [elementBg, setElementBg] = useState(store.data.container.style.background || store.data.container.style.backgroundColor);

  // 屏幕尺寸选项
  const screenSize = useMemo(() => [
    {
      label: 'PC',
      options: [
        { label: '1360 x 760', value: '1360 x 760' },
        { label: '1280 x 720', value: '1280 x 720' },
        { label: '800 x 600', value: '800 x 600' }
      ]
    },
    {
      label: 'H5',
      options: [
        { label: '360 x 780', value: '360 x 780' },
        { label: 'iPhone 6/7/8', value: '375 x 667' },
        { label: 'iPhone 6/7/8 Plus', value: '414 x 736' }
      ]
    }
  ], []);

  useEffect(() => {
    const [width, height] = editorSize.split(' x ');
    store.data.container.style.width = parseInt(width, 10);
    store.data.container.style.height = parseInt(height, 10);
  }, [editorSize]);

  useEffect(() => {
    store.data.container.scaleRatio = scaleRatio / 100;
  }, [scaleRatio]);

  useEffect(() => {
    store.data.container.style.background = elementBg;
  }, [elementBg]);

  const handleScaleRatioChange = (val: number) => {
    setScaleRatio(val);
  };

  return (
    <form
      style={{ padding: '0 10px' }}
    >
      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>画布尺寸:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
          <select value={editorSize} onChange={(e) => setEditorSize(e.target.value)}>
            {screenSize.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>缩放比例:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
          <input
            type="number"
            value={scaleRatio}
            onChange={(e) => handleScaleRatioChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <span>%</span>
        </div>
      </div>

      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>画布宽度:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
          <InputNumber value={store.data.container.style.width} onChange={(val) => store.data.container.style.width = val} />
        </div>
      </div>

      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>画布高度:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
          <InputNumber value={store.data.container.style.height} onChange={(val) => store.data.container.style.height = val} />
        </div>
      </div>

      <hr />

      <Background value={elementBg} onChange={(val) => setElementBg(val)} />

      <hr />

      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>画布网格:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)', display: 'flex', justifyContent: 'flex-end' }}>
          <input
            type="checkbox"
            checked={store.data.container.snapToGrid}
            onChange={(e) => store.data.container.snapToGrid = e.target.checked}
          />
        </div>
      </div>

      {store.data.container.snapToGrid && (
        <>
          <div className="el-row" style={{ gap: '10px' }}>
            <div className="el-col" style={{ width: '100px' }}>网格大小:</div>
            <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
              <InputNumber value={store.data.container.gridSize} onChange={(val) => store.data.container.gridSize = val} />
            </div>
          </div>

          <div className="el-row" style={{ gap: '10px' }}>
            <div className="el-col" style={{ width: '100px' }}>网格颜色:</div>
            <div className="el-col" style={{ width: 'calc(100% - 100px)' }}>
              <ColorPicker value={store.data.container.gridColor} onChange={(val) => store.data.container.gridColor = val} />
            </div>
          </div>
        </>
      )}

      <hr />

      <div className="el-row" style={{ gap: '10px' }}>
        <div className="el-col" style={{ width: '100px' }}>参考线:</div>
        <div className="el-col" style={{ width: 'calc(100% - 100px)', display: 'flex', justifyContent: 'flex-end' }}>
          <input
            type="checkbox"
            checked={store.data.container.markline.show}
            onChange={(e) => store.data.container.markline.show = e.target.checked}
          />
        </div>
      </div>
    </form>
  );
};

export default CanvasSettingsForm;
