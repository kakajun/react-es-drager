import React from 'react'
import Drager from 'react-es-drager'
import imgUrl from '../assets/demo.png'
import './slot.less'
import ContentEditable from 'react-contenteditable'

function App() {
  const text = React.useRef('文本类型')
  const handleChange = (evt: { target: { value: string } }) => {
    text.current = evt.target.value
  }

  const handleBlur = () => {
    console.log(text.current)
  }

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
        type="image"
        rotatable
      >
        <span className="absolute">图片类型</span>
        <img className="img" style={{ width: '100%', height: '100%' }} src={imgUrl} />
      </Drager>

      <Drager
        className="drager-text"
        type="text"
        defaultSize={{
          left: 350,
          top: 100,
          width: 300,
          height: 32
        }}
      >
        <ContentEditable html={text.current} onBlur={handleBlur} onChange={handleChange} />
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 100,
          top: 300
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
          top: 300
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
          top: 300
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
          left: 500,
          top: 300
        }}
        selected={true}
        resizeList={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
      >
        control handle display
      </Drager>

      <Drager
        defaultSize={{
          width: 100,
          height: 100,
          left: 100,
          top: 450
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
