import { TextField } from 'mdui'
import React, { useEffect, useRef } from 'react'

type Props = React.JSX.IntrinsicElements['mdui-text-field'] & {
  onClear?: React.EventHandler<React.ChangeEvent>
}

const TextInput: React.FC<Props> = (props) => {
  const { className = '', children, ...rest } = props

  const ref = useRef<TextField>(null)

  useEffect(() => {
    if (ref.current) {
      const input = ref.current
      // @ts-ignore
      input.addEventListener('change', props.onChange)
      // @ts-ignore
      input.addEventListener('clear', props.onClear)
    }
  })

  return (
    <mdui-text-field
      // @ts-ignore why is TextField not TextField ??
      ref={ref}
      // @ts-ignore For Web Components we have to ignore this **ERROR**
      class={`${className}`}
      {...rest}
    >
      {children}
    </mdui-text-field>
  )
}

TextInput.displayName = 'mdui-text-field'

export default TextInput
