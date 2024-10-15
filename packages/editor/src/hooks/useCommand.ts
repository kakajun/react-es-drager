import { EditorState } from '../types'
import { deepCopy, events } from '../utils'
import React, { useState, useEffect, useRef } from 'react'

type QueueType = {
  redo?: Function
  undo?: Function
}

type CommandType = {
  name: string
  keyboard?: string
  pushQueue?: boolean
  init?: Function
  execute: (...args: any[]) => QueueType
}

export type CommandStateType = {
  current: number
  queue: QueueType[]
  commands: { [key in string]: any }
  commandArray: CommandType[]
  destoryArray: any[]
}

export function useCommand(store: EditorState) {
  const state: CommandStateType = {
    current: -1,
    queue: [],
    commands: {},
    commandArray: [],
    destoryArray: []
  }

  const registry = (command: CommandType) => {
    state.commandArray.push(command)
    state.commands[command.name] = (...args: any[]) => {
      const { redo, undo } = command.execute(...args)
      redo && redo()

      if (command.pushQueue) {
        let { queue } = state
        if (queue.length > 0) {
          queue = queue.slice(0, state.current + 1)
          state.queue = queue
        }
        state.queue.push({ redo, undo })
        state.current += 1
      }
    }
  }

  registry({
    name: 'redo',
    keyboard: 'ctrl+y',
    execute() {
      return {
        redo() {
          let item = state.queue[state.current + 1]
          if (item) {
            item.redo && item.redo()
            state.current++
          }
        }
      }
    }
  })

  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    execute() {
      return {
        redo() {
          if (state.current === -1) return
          let item = state.queue[state.current]
          if (item) {
            item.undo && item.undo()
            state.current--
          }
        }
      }
    }
  })

  registry({
    name: 'drag',
    pushQueue: true,
    init() {
      const dragstart = () => {
        ;(this as any).before = deepCopy(store.data.elements)
      }
      const dragend = () => state.commands.drag()

      events.on('dragstart', dragstart)
      events.on('dragend', dragend)

      return () => {
        events.off('dragstart', dragstart)
        events.off('dragend', dragend)
      }
    },
    execute() {
      const before = (this as any).before
      const after = store.data.elements
      return {
        redo() {
          store.data = { ...store.data, elements: after }
        },
        undo() {
          store.data = { ...store.data, elements: before }
        }
      }
    }
  })

  registry({
    name: 'updateContainer',
    pushQueue: true,
    execute(newValue) {
      const state = {
        before: store.data,
        after: newValue
      }
      return {
        redo() {
          store.data = state.after
        },
        undo() {
          store.data = state.before
        }
      }
    }
  })

  const keyboardEvent = () => {
    const onKeydown = (e: KeyboardEvent) => {
      const { ctrlKey, key } = e
      const keyArr = []
      if (ctrlKey) keyArr.push('ctrl')
      keyArr.push(key)
      const keyStr = keyArr.join('+')

      state.commandArray.forEach(({ name, keyboard }) => {
        if (!keyboard) return
        if (keyboard === keyStr) {
          state.commands[name]()
          e.preventDefault()
        }
      })
    }
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }

  useEffect(() => {
    state.destoryArray.push(keyboardEvent())
    return () => {
      state.destoryArray.forEach((fn) => fn && fn())
    }
  }, [])

  return state
}
