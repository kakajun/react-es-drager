import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal } from 'antd'
// import ace from 'ace-builds'
// import 'ace-builds/src-min-noconflict/theme-one_dark'
// import 'ace-builds/src-min-noconflict/mode-json5'
import dayjs from 'dayjs'

const Dialog = ({ option }) => {
  const [visible, setVisible] = useState(false)
  const [currentOption, setCurrentOption] = useState(option || {})
  const editorRef = useRef(null)

  useEffect(() => {
    if (visible) {
      const editor = ace.edit(editorRef.current, {
        maxLines: 34,
        minLines: 34,
        fontSize: 14,
        theme: 'ace/theme/one_dark',
        mode: 'ace/mode/json5',
        tabSize: 4,
        readOnly: false
      })

      editor.setValue(JSON.stringify(JSON.parse(currentOption.content), null, 4))

      return () => {
        editor.destroy()
      }
    }
  }, [visible, currentOption])

  const open = (newOption) => {
    setCurrentOption(newOption)
    setVisible(true)
  }

  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleConfirm = () => {
    const { confirm } = currentOption
    confirm && confirm(editorRef.current.session.getValue())
  }

  const handleExport = () => {
    if (!editorRef.current) return

    const link = document.createElement('a')
    const filename = dayjs().format('YYYY-MM-DD') + '-es-drager.json'
    link.download = filename

    const blob = new Blob([editorRef.current.session.getValue()])
    const href = URL.createObjectURL(blob)
    link.href = href

    link.click()
    URL.revokeObjectURL(href)
  }

  return (
    <Modal open={visible} {...currentOption} onOk={handleOk} draggable onCancel={handleCancel}>
      <div ref={editorRef} id="esEditor"></div>

      <template slot="footer">
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleConfirm}>
          保存编辑
        </Button>
        <Button type="primary" onClick={handleExport}>
          导出JSON
        </Button>
      </template>
    </Modal>
  )
}

export default Dialog
