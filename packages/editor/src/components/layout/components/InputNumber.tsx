import React, { forwardRef, useImperativeHandle } from 'react'
import { InputNumber } from 'antd'
import './InputNumber.less'

interface Props {
  prefix?: string
  [key: string]: any // 其他属性
}

const EsInputNumber: React.ForwardRefRenderFunction<any, Props> = (props, ref) => {
  const { prefix, ...otherProps } = props

  useImperativeHandle(ref, () => ({
    // 可以在这里添加任何需要暴露的方法
  }))

  const hasPrefix = Boolean(prefix)

  return (
    <div className={`es-input-number ${hasPrefix ? 'has-prefix' : ''}`}>
      <div className="es-input-number-prefix">{prefix && <span>{prefix}:</span>}</div>
      <InputNumber {...otherProps} />
    </div>
  )
}

export default forwardRef(EsInputNumber)
