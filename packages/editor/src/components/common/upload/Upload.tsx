import React, { useRef, useEffect, useState } from 'react'

const acceptMap = {
  json: '.json',
  image: 'image/*'
}

interface UploadOption {
  accept?: string
  resultType?: string
  onChange?: (result: any) => void
}

interface Props {
  option: UploadOption
}

const UploadComponent: React.FC<Props> = ({ option }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [state, setState] = useState({ option })

  useEffect(() => {
    open(option)
  }, [option])

  const open = (newOption: UploadOption) => {
    setState({ option: newOption })
    const accept = acceptMap[newOption.resultType] || newOption.accept || ''
    if (inputRef.current) {
      inputRef.current.setAttribute('accept', accept)
      inputRef.current.click()
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!state.option || !state.option.onChange) return

    const { resultType, onChange } = state.option
    const file = e.target.files && e.target.files[0]

    if (!file) return

    let result: any = file

    if (['json', 'text'].includes(resultType)) {
      result = await readFile(file, 'text')
    } else if (resultType === 'image') {
      result = await readFile(file, 'image')
    }

    onChange(result)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const readFile = (file: File, type: string) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', (e) => {
        const result = e.target!.result || '{}'
        resolve(result)
      })

      if (type === 'text') {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  return (
    <input
      ref={inputRef}
      type="file"
      accept={state.option?.accept || ''}
      className="es-upload"
      onChange={handleChange}
    />
  )
}

export default UploadComponent
