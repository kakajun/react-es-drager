import { useEditorContainer } from '../../../hooks'
import React, { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'
export function $dialog(option: Object) {
  const globalContainer = useEditorContainer().container
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!dialogRef.current) {
      dialogRef.current = React.createElement(Dialog)
      globalContainer.appendChild(dialogRef.current)
    }

    const { open } = dialogRef.current.props
    open(option)
  }, [option])
}
