import React from 'react'
import Drager from 'react-es-drager'
import { useTranslation } from 'react-i18next'
import './Basic.less'
import './Basic.less'
const dragList = [
  [
    { text: 'examples.move', resizable: false, rotatable: false },
    { color: '#00c48f', text: 'examples.moveAndResize', rotatable: false },
    {
      color: '#ff9f00',
      text: 'examples.rotate',
      // angle: 30,
      rotatable: true,
      resizable: false
    },
    { color: '#f44336', text: 'examples.rotateAndResize', rotatable: true }
  ],
  [
    { color: '#6A00FF', text: 'examples.boundary', boundary: true },
    { color: '#A20025', text: 'examples.disabled', disabled: true },
    { color: '#D80073', text: 'examples.checkCollision', checkCollision: true },
    { color: '#1BA1E2', text: 'examples.minSzie', minWidth: 10, minHeight: 10 }
  ],
  [
    { color: '#31eff6', text: 'examples.snap', boundary: true, snap: true },
    { color: '#f46619', text: 'examples.markline', boundary: true, markline: true },
    {
      color: '#6bf419',
      text: 'examples.snapAndMarkline',
      boundary: true,
      snap: true,
      markline: true
    }
  ]
]
const BasicComponent = () => {
  const { t } = useTranslation()

  return (
    <>
      {dragList.map((list, index) =>
        list.map((item, index2) => (
          <Drager
            key={`${index}-${index2}`}
            width={100}
            height={100}
            left={index2 * 150 + 30}
            top={index * 150 + 30}
            {...item}
            style={{ color: item.color }}
          >
            {t(item.text)}
          </Drager>
        ))
      )}
    </>
  )
}

export default BasicComponent
