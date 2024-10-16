import React, { useRef, useEffect } from 'react'
import './TextEditor.less'
type Props = {
  editable: boolean
  text?: string
  children: React.ReactNode
}

const EsText: React.FC<Props> = ({ editable, text, children }) => {
  const textRef = useRef<HTMLDivElement>(null)

  const selectText = () => {
    if (!textRef.current) return
    const range = document.createRange()
    range.selectNode(textRef.current)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
  }

  useEffect(() => {
    if (editable) {
      selectText()
    }
  }, [editable])

  return (
    <div
      ref={textRef}
      className={['es-text', { editable: editable }].join(' ')}
      contentEditable={editable}
    >
      {children || text}
    </div>
  )
}

export default EsText
