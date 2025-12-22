import { ButtonIcon } from 'mdui'
import React from 'react'

interface Props {
  disabled?: boolean
  active?: boolean
  title?: string
  className?: string
  icon?: string
  variant?: ButtonIcon['variant']
  onClick?(): void
}

const PaginationItem: React.FC<Props> = (props) => {
  const classes = ['page-item']
  if (props.active) {
    classes.push('active')
  }
  if (props.disabled) {
    classes.push('disabled')
  }
  if (props.className) {
    classes.push(props.className)
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!props.disabled && props.onClick) {
      props.onClick()
    }
  }

  if (!props.icon) {
    return (
      <mdui-button-icon
        className={classes.join(' ')}
        title={props.title}
        onClick={handleClick}
        disabled={props.disabled}
        variant={props.variant}
      >
        <span aria-disabled={props.disabled} style={{ fontSize: 'medium' }}>
          {props.children}
        </span>
      </mdui-button-icon>
    )
  } else {
    return (
      <mdui-button-icon
        className={classes.join(' ')}
        title={props.title}
        onClick={handleClick}
        disabled={props.disabled}
        icon={props.icon}
        variant={props.variant}
      />
    )
  }
}

export default PaginationItem
