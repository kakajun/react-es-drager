import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import Dialog from './Dialog'

type DialogOption = {
  title?: string
  content?: string
  confirm?: (text: string) => void
}

let dialogRoot: Root | null = null
let container: HTMLElement | null = null

export function $dialog(option: DialogOption) {
  if (!dialogRoot) {
    container = document.createElement('div')
    document.body.appendChild(container)
    dialogRoot = createRoot(container)
  }
  dialogRoot.render(<Dialog option={option} />)
}