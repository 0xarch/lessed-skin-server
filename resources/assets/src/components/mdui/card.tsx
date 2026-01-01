import { Card as CardType } from 'mdui'
import React, { forwardRef } from 'react'

type Props = React.JSX.IntrinsicElements['mdui-card'] & {
  prose?: boolean
}

const Card = forwardRef<CardType, Props>((props, ref) => {
  const { className = '', children, ...rest } = props

  return (
    <mdui-card
      ref={ref}
      // @ts-ignore For Web Components we have to ignore this **ERROR**
      class={`md-card ${props.prose ? 'mdui-prose' : ''} ${className}`}
      {...rest}
    >
      {children}
    </mdui-card>
  )
})

Card.displayName = 'mdui-card'

export default Card
