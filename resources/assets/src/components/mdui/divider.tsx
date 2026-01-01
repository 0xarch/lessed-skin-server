import React from 'react'

type Props = React.JSX.IntrinsicElements['mdui-divider'] & {
  'space-only'?: boolean
}

const Divider: React.FC<Props> = (props) => {
  const { className = '', children, style, ...rest } = props

  return (
    <mdui-divider
      // @ts-ignore For Web Components we have to ignore this **ERROR**
      class={`md-br ${className}`}
      style={{
        ...(props['space-only']
          ? {
              visibility: 'hidden',
            }
          : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </mdui-divider>
  )
}

Divider.displayName = 'mdui-divider'

export default Divider
