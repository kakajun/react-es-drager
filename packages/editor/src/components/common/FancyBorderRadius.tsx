import React, { useState, useEffect, useRef } from 'react';

type HandleType = {
  side: string;
  left?: number;
  top?: number;
};

interface Props {
  onChange: (borderRadius: string) => void;
}

const FancyBorderRadius: React.FC<Props> = ({ onChange }) => {
  const [borderRadius, setBorderRadius] = useState('');
  const [handleList, setHandleList] = useState<HandleType[]>([
    { side: 'left', top: 100 },
    { side: 'top' },
    { side: 'right', left: 100 },
    { side: 'bottom', left: 100, top: 100 }
  ]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    updateRadius();
  }, [handleList]);

  const onMouseDown = (handle: HandleType, e: React.MouseEvent) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const parent = containerRef.current;
    const parentRect = parent?.getBoundingClientRect()!;

    const isAxisX = ['top', 'bottom'].includes(handle.side);

    const onMouseMove = (e: MouseEvent) => {
      let disX = (e.clientX - parentRect.left) * 100 / parentRect.width;
      let disY = (e.clientY - parentRect.top) * 100 / parentRect.height;

      disX = Math.min(100, Math.max(0, disX));
      disY = Math.min(100, Math.max(0, disY));

      if (isAxisX) {
        handle.left = disX;
      } else {
        handle.top = disY;
      }

      updateRadius();
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    setHandleList([...handleList]);
  };

  const updateRadius = () => {
    const state = handleList.reduce((map, item) => {
      const isAxisX = ['top', 'bottom'].includes(item.side);
      if (isAxisX) {
        map[item.side] = item.left || 0;
      } else {
        map[item.side] = item.top || 0;
      }
      return map;
    }, {} as any);

    let brd = `${state.top}% `;
    brd += `${100 - state.top}% `;
    brd += `${100 - state.bottom}% `;
    brd += `${state.bottom}% / `;

    brd += `${state.left}% `;
    brd += `${state.right}% `;
    brd += `${100 - state.right}% `;
    brd += `${100 - state.left}% `;

    setBorderRadius(brd);
    onChange(brd);
  };

  return (
    <div className="es-fancy-border-radius" ref={containerRef}>
      <div>
        <slot />
      </div>
      {handleList.map((item, index) => (
        <div
          key={index}
          className={`handle ${item.side}`}
          style={{
            left: `${item.left || 0}%`,
            top: `${item.top || 0}%`
          }}
          onMouseDown={(e) => onMouseDown(item, e)}
        />
      ))}
    </div>
  );
};

export default FancyBorderRadius;
