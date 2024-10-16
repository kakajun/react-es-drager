import { create } from 'zustand'
import { ComponentType, EditorDataType } from '../types'
interface EditorState {
  data: EditorDataType
  current: ComponentType
  preview: boolean
  initWidth: number
  initHeight: number
  theme: string
}

const defaultData = {
  container: {
    markline: {
      show: true,
      color: ''
    },
    snapToGrid: true,
    gridSize: 10,
    gridColor: '',
    style: {},
    scaleRatio: 1
  },
  elements: []
}

export const useEditorStore = create<EditorState>((set) => ({
  data: defaultData,
  current: {},
  preview: false,
  initWidth: 1180,
  initHeight: 960,
  theme: localStorage.getItem('theme') || 'light',
  update: (val: EditorDataType) => {
    if (!val.container) {
      val.container = { ...defaultData.container }
    }
    set({ data: val || {} })
  },
  updateCurrent: (updates: ComponentType) =>
    set((state: ComponentType) => ({
      current: { ...state.current, ...updates }
    }))
}))
