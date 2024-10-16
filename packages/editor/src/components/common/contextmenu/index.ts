import React, { useRef, useEffect } from 'react'
import Menu from './Menu' // 假设Menu组件已经适配了React

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

const menuRef = useRef<React.ReactInstance>(null)

export const $contextmenu = (option: MenuOption) => {
  if (!menuRef.current) {
    const container = document.createElement('div')
    document.body.appendChild(container) // 假设这里使用body作为容器，实际使用时应根据具体情况调整

    menuRef.current = React.createElement(Menu, { option })

    ReactDOM.render(menuRef.current, container)
  } else {
    ;(menuRef.current as any).props.open(option)
  }
}
