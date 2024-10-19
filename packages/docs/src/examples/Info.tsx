import { useState } from 'react'
import Drager, { type DragData } from 'react-es-drager'
import { Input } from 'antd'
import './info.less'

function DragerComponent() {
  const [info, setInfo] = useState<DragData>({
    width: 120,
    height: 120,
    left: 100,
    top: 100,
    angle: 20
  })

  const onChange = (dragData: DragData) => {
    setInfo(dragData)
  }

  const handleInputChange = (key: keyof DragData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const parsedValue = value ? parseInt(value) : 0 // 处理空字符串和非数字输入
    setInfo({ ...info, [key]: parsedValue })
  }

  return (
    <>
      <Drager {...info} rotatable onChange={onChange} />

      <div className="es-info">
        <div className="es-info-item">
          <span>width</span>
          <Input value={info.width} onChange={handleInputChange('width')} />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">height</span>
          <Input value={info.height} onChange={handleInputChange('height')} />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">left</span>
          <Input value={info.left} onChange={handleInputChange('left')} />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">top</span>
          <Input value={info.top} onChange={handleInputChange('top')} />
        </div>
        <div className="es-info-item">
          <span className="es-info-item-label">angle</span>
          <Input value={info.angle} onChange={handleInputChange('angle')} />
        </div>
      </div>
    </>
  )
}

export default DragerComponent
