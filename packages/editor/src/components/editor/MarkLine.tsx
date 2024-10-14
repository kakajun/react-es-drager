import React from 'react'
import './MarkLine.less'
type Props = {
  left: number | null
  top: number | null
}

const EsEditorMarkline: React.FC<Props> = ({ left, top }) => {
  return (
    <>
      <div
        className="es-editor-markline-left"
        style={{ left: left !== null ? `${left}px` : 'none' }}
        hidden={left === null}
      />
      <div
        className="es-editor-markline-top"
        style={{ top: top !== null ? `${top}px` : 'none' }}
        hidden={top === null}
      />
    </>
  )
}

export default EsEditorMarkline
