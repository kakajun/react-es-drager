import React, { useRef, useEffect } from 'react'
import Menu from './Menu'
import ReactDOM from 'react-dom/client';
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

const menuRef = useRef<ReactDOM.Root | null>(null);

export const $contextmenu = (option: MenuOption) => {
  if (!menuRef.current) {
    const container = document.createElement('div');
    document.body.appendChild(container); // 假设这里使用body作为容器，实际使用时应根据具体情况调整

    menuRef.current = ReactDOM.createRoot(container);
    menuRef.current.render(<Menu option={option} />);
  } else {
    menuRef.current.render(<Menu option={option} />);
  }
};
