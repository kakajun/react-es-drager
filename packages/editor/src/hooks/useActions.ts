import React, { useState, useEffect, useRef } from 'react'
import { $contextmenu, ActionType, MenuItem } from '../components/common'
import { ComponentType, EditorDataType } from '../types'
import { cancelGroup, deepCopy, makeGroup, useId } from '../utils'

type ActionMethods = {
  [key in ActionType]?: (element: ComponentType, ...args: any[]) => void
}

const keyboardMap = {
  'ctrl+x': 'cut',
  'ctrl+c': 'copy',
  'ctrl+v': 'paste',
  Delete: 'remove',
  'ctrl+a': 'selectAll',
  'ctrl+d': 'duplicate'
}

export function useActions(
  data: EditorDataType,
  editorRef: React.MutableRefObject<HTMLElement | null>
) {
  const editorRect = () => {
    return editorRef.current?.getBoundingClientRect() || ({} as DOMRect)
  }

  let currentMenudownElement: ComponentType | null = null
  let copySnapshot: ComponentType | null = null

  const getIndex = (element: ComponentType | null) => {
    if (!element) return -1
    return data.elements.findIndex((item) => item.id === element.id)
  }

  const swap = (i: number, j: number) => {
    ;[data.elements[i], data.elements[j]] = [data.elements[j], data.elements[i]]
  }

  const addElement = (element: ComponentType | null) => {
    if (!element) return
    const newElement = deepCopy(element)
    newElement.id = useId()
    data.elements.push(newElement)
  }

  const actions: ActionMethods = {
    remove() {
      const index = getIndex(currentMenudownElement)
      if (index > -1) data.elements.splice(index, 1)
    },
    cut(element) {
      copySnapshot = element
      actions.remove!(element)
    },
    copy(element) {
      copySnapshot = element
    },
    duplicate(element) {
      const newElement = deepCopy(element)
      newElement.left += 10
      newElement.top += 10
      addElement(newElement)
    },
    top(element) {
      const index = getIndex(element)
      const [topElement] = data.elements.splice(index, 1)
      data.elements.push(topElement)
    },
    bottom(element) {
      const index = getIndex(element)
      const [topElement] = data.elements.splice(index, 1)
      data.elements.unshift(topElement)
    },
    group() {
      data.elements = makeGroup(data.elements, editorRect())
    },
    ungroup() {
      data.elements = cancelGroup(data.elements, editorRect())
    },
    paste(_, clientX: number, clientY: number) {
      if (!copySnapshot) return
      const element = deepCopy(copySnapshot)
      element.left = clientX - editorRect().left
      element.top = clientY - editorRect().top
      addElement(element)
    },
    selectAll() {
      data.elements.forEach((item) => (item.selected = true))
    },
    lock(element) {
      const index = getIndex(element)
      data.elements[index].disabled = !data.elements[index].disabled
    },
    moveUp(element) {
      const index = getIndex(element)
      if (index >= data.elements.length - 1) return
      swap(index, index + 1)
    },
    moveDown(element) {
      const index = getIndex(element)
      if (index <= 0) return
      swap(index, index - 1)
    }
  }

  const onContextmenu = (e: React.MouseEvent, item: ComponentType) => {
    e.preventDefault()
    const { clientX, clientY } = e.nativeEvent
    currentMenudownElement = deepCopy(item)

    const selectedElements = data.elements.filter((item) => item.selected)
    const actionItems: MenuItem[] = [
      { action: 'remove', label: '删除' },
      { action: 'cut', label: '剪切' },
      { action: 'copy', label: '复制' },
      { action: 'duplicate', label: '创建副本' },
      { action: 'top', label: '置顶' },
      { action: 'bottom', label: '置底' },
      { action: 'moveUp', label: '上移一层' },
      { action: 'moveDown', label: '下移一层' }
    ]

    if (!item.group && selectedElements.length > 1) {
      actionItems.push({ action: 'group', label: '组合' })
    } else if (item.group) {
      actionItems.push({ action: 'ungroup', label: '取消组合' })
    }

    const isLocked = currentMenudownElement!.disabled
    const lockAction: MenuItem = { action: 'lock', label: '锁定 / 解锁' }
    if (!isLocked) {
      actionItems.push(lockAction)
    }

    $contextmenu({
      clientX,
      clientY,
      items: !isLocked ? actionItems : [lockAction],
      onClick: ({ action }) => {
        if (actions[action]) {
          actions[action]!(currentMenudownElement!)
        }
      }
    })
  }

  const onEditorContextMenu = (e: React.MouseEvent) => {
    const { clientX, clientY } = e.nativeEvent
    $contextmenu({
      clientX,
      clientY,
      items: [
        { action: 'paste', label: '在这粘贴' },
        { action: 'selectAll', label: '全选' }
      ],
      onClick: ({ action }) => {
        if (action === 'paste') {
          actions.paste!(currentMenudownElement!, clientX, clientY)
        } else {
          actions[action] && actions[action]!(currentMenudownElement!)
        }
      }
    })
  }

  const onKeydown = (e: React.KeyboardEvent) => {
    const { ctrlKey, key } = e
    const keyArr = []
    if (ctrlKey) keyArr.push('ctrl')
    keyArr.push(key)
    const keyStr = keyArr.join('+')
    const action = keyboardMap[keyStr] as ActionType
    if (actions[action]) {
      e.preventDefault()
      currentMenudownElement = data.elements.find((item) => item.selected) || null
      actions[action]!(currentMenudownElement!)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [])

  return {
    editorRect,
    onContextmenu,
    onEditorContextMenu
  }
}
