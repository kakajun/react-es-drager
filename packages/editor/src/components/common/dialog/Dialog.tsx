import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal  } from 'antd'
// import ace from 'ace-builds'
// import 'ace-builds/src-min-noconflict/theme-one_dark'
// import 'ace-builds/src-min-noconflict/mode-json5'
import dayjs from 'dayjs'

interface Props {
  option: {
    content?: string
    confirm?: (value: string) => void
  }
}

const EditorDialog: React.FC<Props> = ({ option }) => {
  const [state, setState] = useState({
    option,
    visible: false
  })

  const editorRef = useRef(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.visible && editorContainerRef.current) {
      editorRef.current = ace.edit(editorContainerRef.current, {
        maxLines: 34,
        minLines: 34,
        fontSize: 14,
        theme: 'ace/theme/one_dark',
        mode: 'ace/mode/json5',
        tabSize: 4,
        readOnly: false
      })

      if (state.option.content) {
        editorRef.current!.setValue(JSON.stringify(JSON.parse(state.option.content), null, 4))
      }
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
      }
    }
  }, [state.visible])

  const open = (newOption: Record<string, any>) => {
    setState((prevState) => ({
      ...prevState,
      option: newOption,
      visible: true
    }))
  }

  const close = () => {
    setState((prevState) => ({
      ...prevState,
      visible: false
    }))
  }

  const handleConfirm = () => {
    const { confirm } = state.option
    confirm && confirm(editorRef.current?.getValue())
  }

  const handleExport = () => {
    if (!editorRef.current) return

    const link = document.createElement('a')
    const filename = dayjs().format('YYYY-MM-DD') + '-es-drager.json'
    link.download = filename

    const blob = new Blob([editorRef.current.getValue()])
    const href = URL.createObjectURL(blob)
    link.href = href
    link.click()
    URL.revokeObjectURL(href)
  }

  return <div></div>
}

export default EditorDialog
