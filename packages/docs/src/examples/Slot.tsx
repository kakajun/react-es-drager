import Drager from 'react-es-drager'
import imgUrl from '../assets/demo.png'
import './slot.less'

function App() {
  return (
    <>
      <Drager width={200} height={120} left={100} top={100} rotatable>
        <img className="img" style={{ width: '100%', height: '100%' }} src={imgUrl} />
      </Drager>

      <Drager width={100} height={100} left={100} top={300} rotatable>
        <div> resize handle</div>

        <div slot="resize" className="custom-resize" />
      </Drager>

      <Drager
        width={100}
        height={100}
        left={300}
        top={300}
        selected
        resizeList={['top', 'bottom', 'left', 'right']}
      >
        control handle display
      </Drager>

      <Drager
        width={100}
        height={100}
        left={500}
        top={300}
        selected
        resizeList={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
      >
        control handle display
      </Drager>

      <Drager width={100} height={100} left={100} top={450} rotatable>
        rotate handle
        <div slot="rotate" className="custom-rotate">
          E
        </div>
      </Drager>
    </>
  )
}

export default App
