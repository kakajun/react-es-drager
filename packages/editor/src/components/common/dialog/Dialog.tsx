import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import dayjs from 'dayjs'

type DialogOption = {
  title?: string
  content?: string
  confirm?: (text: string) => void
}

const Dialog: React.FC<{ option: DialogOption }> = ({ option }) => {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState<string>('')

  useEffect(() => {
    if (option) {
      setText(option.content || '')
      setVisible(true)
    }
  }, [option])

  const handleCancel = () => setVisible(false)
  const handleConfirm = () => {
    try {
      option.confirm && option.confirm(text)
      setVisible(false)
    } catch (_) {
      // ignore
    }
  }

  const handleExport = () => {
    const link = document.createElement('a')
    const filename = dayjs().format('YYYY-MM-DD') + '-es-drager.json'
    link.download = filename

    const blob = new Blob([text])
    const href = URL.createObjectURL(blob)
    link.href = href
    link.click()
    URL.revokeObjectURL(href)
  }

  return (
    <Modal
      open={visible}
      title={option.title}
      footer={
        <>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleConfirm}>
            保存编辑
          </Button>
          <Button type="primary" onClick={handleExport}>
            导出JSON
          </Button>
        </>
      }
      onCancel={handleCancel}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: 400, fontFamily: 'monospace' }}
      />
    </Modal>
  )
}

export default Dialog
