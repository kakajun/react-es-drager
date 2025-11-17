import React from 'react'
import Menu from './Menu'
import { createRoot, type Root } from 'react-dom/client'
export type ActionType =
  | 'remove'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'duplicate'
  | 'top'
  | 'bottom'
  | 'group'
  | 'ungroup'
  | 'selectAll'
  | 'lock'
  | 'moveUp'
  | 'moveDown'

export type MenuItem = {
  label: string
  action: ActionType
}

export type MenuOption = {
  clientX?: number
  clientY?: number
  items?: MenuItem[]
  onClick?: (item: MenuItem) => void
}
let menuRoot: Root | null = null
let container: HTMLElement | null = null

export const $contextmenu = (option: MenuOption) => {
  if (!menuRoot) {
    container = document.createElement('div')
    document.body.appendChild(container)
    menuRoot = createRoot(container)
  }
  menuRoot.render(<Menu option={option} />)
}
