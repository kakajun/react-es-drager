import { useState } from 'react';
import Drager, { type DragData } from 'es-drager';

function DragerComponent() {
  const [info, setInfo] = useState<DragData>({
    width: 120,
    height: 120,
    left: 100,
    top: 100,
    angle: 20
  });

  const onChange = (dragData: DragData) => {
    setInfo(dragData);
  };

  return (
    <>
      <Drager {...info} rotatable onChange={onChange} />

      <div className="es-info">
        <div className="es-info-item">
          <span>width</span>
          <input
            type="number"
            value={info.width}
            onChange={(e) => setInfo({ ...info, width: parseInt(e.target.value) })}
          />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">height</span>
          <input
            type="number"
            value={info.height}
            onChange={(e) => setInfo({ ...info, height: parseInt(e.target.value) })}
          />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">left</span>
          <input
            type="number"
            value={info.left}
            onChange={(e) => setInfo({ ...info, left: parseInt(e.target.value) })}
          />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">top</span>
          <input
            type="number"
            value={info.top}
            onChange={(e) => setInfo({ ...info, top: parseInt(e.target.value) })}
          />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">angle</span>
          <input
            type="number"
            value={info.angle}
            onChange={(e) => setInfo({ ...info, angle: parseInt(e.target.value) })}
          />
        </div>
      </div>
    </>
  );
}

export default DragerComponent;
