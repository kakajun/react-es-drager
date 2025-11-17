import React from 'react'
import Upload from './Upload'
import { createRoot, type Root } from 'react-dom/client'

type ResultType = 'text' | 'json' | 'image' | 'custom'
export type UploadOption = {
  resultType: ResultType
  accept?: string
  onChange?: (e: any) => void
}
let uploadRoot: Root | null = null
let container: HTMLElement | null = null

export const $upload = (option: UploadOption) => {
  if (!uploadRoot) {
    container = document.createElement('div')
    document.body.appendChild(container)
    uploadRoot = createRoot(container)
  }
  uploadRoot.render(<Upload option={option} />)
}