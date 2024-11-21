import React from 'react'
import Drager from 'react-es-drager'
import imgUrl from '../assets/demo.png'
import './slot.less'

function App() {
  return (
    <>
      <Drager
        defaultSize={{
          width: 200,
          height: 120,
          left: 100,
          top: 100,
          angle: 0
        }}
        rotatable
      >
        <img className="img" style={{ width: '100%', height: '100%' }} src={imgUrl} />
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 100,
          top: 300,
          angle: 0
        }}
        rotatable
      >
        <div> resize handle</div>

        <div slot="resize" className="custom-resize" />
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 300,
          top: 300,
          angle: 0
        }}
        selected
        resizeList={['top', 'bottom', 'left', 'right']}
      >
        control handle display
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 500,
          top: 300,
          angle: 0
        }}
        selected
        resizeList={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
      >
        control handle display
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 100,
          top: 450,
          angle: 0
        }}
        rotatable
      >
        rotate handle
        <div slot="rotate" className="custom-rotate">
          E
        </div>
      </Drager>
    </>
  )
}

export default App
