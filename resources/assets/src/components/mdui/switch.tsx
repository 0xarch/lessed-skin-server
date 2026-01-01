import { Switch as SwitchType } from 'mdui'
import React, { useEffect, useRef } from 'react'

type Props = React.JSX.IntrinsicElements['mdui-switch'] & {
  onClear?: React.EventHandler<React.ChangeEvent>
}

const Switch: React.FC<Props> = (props) => {
  const { className = '', children, ...rest } = props

  const ref = useRef<SwitchType>(null)

  useEffect(() => {
    if (ref.current) {
      const input = ref.current
      // @ts-ignore
      input.addEventListener('change', props.onChange)
    }
  })

  return (
    <mdui-switch
      ref={ref}
      // @ts-ignore For Web Components we have to ignore this **ERROR**
      class={`${className}`}
      {...rest}
    >
      {children}
    </mdui-switch>
  )
}

Switch.displayName = 'mdui-switch'

export default Switch
