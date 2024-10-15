import React, { useState, useEffect } from 'react';
import InputNumber from './InputNumber';
import ColorPicker from './ColorPicker';
import { useEditorStore } from '@es-drager/editor/src/store';

const BorderSettings = () => {
  const store = useEditorStore();
  const [borderStyle, setBorderStyle] = useState('solid');
  const borderStyleList = [
    { label: '实线', value: 'solid' },
    { label: '虚线', value: 'dashed' },
    { label: '点线', value: 'dotted' },
  ];

  useEffect(() => {
    setBorderStyle(store.current.style?.borderStyle || 'solid');
  }, [store.current.style?.borderStyle]);

  useEffect(() => {
    if (store.current.style) {
      store.current.style.borderStyle = borderStyle;
    }
  }, [borderStyle]);

  return (
    <div>
      {store.current.style && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ width: '100px' }}>边框风格:</div>
            <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)}>
              {borderStyleList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ width: '100px' }}>边框颜色:</div>
            <ColorPicker value={store.current.style.borderColor} onChange={(color) => {
              store.current.style.borderColor = color;
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ width: '100px' }}>边框宽度:</div>
            <InputNumber value={store.current.style.borderWidth} onChange={(width) => {
              store.current.style.borderWidth = width;
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ width: '100px' }}>边框半径:</div>
            <InputNumber value={store.current.style.borderRadius} onChange={(radius) => {
              store.current.style.borderRadius = radius;
            }} />
          </div>
        </>
      )}
    </div>
  );
};

export default BorderSettings;
