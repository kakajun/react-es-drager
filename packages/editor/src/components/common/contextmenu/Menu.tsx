import React, { useState, useEffect, useRef } from 'react'
import { computePosition, flip, shift, offset } from '@floating-ui/react-dom'

interface Props {
  option: MenuOption
}

interface MenuItem {
  label: string
  onClick?: (item: MenuItem) => void
}

interface MenuOption {
  items?: MenuItem[]
  clientX?: number
  clientY?: number
  onClick?: (item: MenuItem) => void
}

const MenuComponent: React.FC<Props> = ({ option }) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState({
    option,
    visible: false,
    top: 0,
    left: 0
  })

  // 菜单的位置
  const style = {
    left: `${state.left}px`,
    top: `${state.top}px`
  }

  // 触发器的位置
  const triggerStyle = {
    left: `${state.option.clientX}px`,
    top: `${state.option.clientY}px`
  }

  // floating-ui 中间件
  const middleware = [shift(), flip(), offset(10)]

  const open = (newOption: MenuOption) => {
    setState((prevState) => ({
      ...prevState,
      option: newOption,
      visible: true
    }))

    computePosition(triggerRef.current!, menuRef.current!, { middleware }).then((data) => {
      setState((prevState) => ({
        ...prevState,
        left: data.x,
        top: data.y
      }))
    })
  }

  const close = () => {
    setState((prevState) => ({
      ...prevState,
      visible: false
    }))
  }

  // 点击菜单项
  const handleItemClick = (item: MenuItem) => {
    state.option.onClick && state.option.onClick(item)
    close()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div>
      <div ref={triggerRef} className="es-trigger" style={triggerStyle} />
      <div
        ref={menuRef}
        className="es-contentmenu"
        style={state.visible ? style : {}}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ul>
          {state.option.items?.map((item) => (
            <li key={item.label} onClick={() => handleItemClick(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MenuComponent
