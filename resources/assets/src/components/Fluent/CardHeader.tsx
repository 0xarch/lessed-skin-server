import React, { forwardRef, ReactNode } from 'react'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children?: ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  const {
    title,
    subtitle,
    icon,
    children,
    className = '',
    ...restProps
  } = props

  return (
    <header
      ref={ref}
      className={`card-header ${className}`.trim()}
      {...restProps}
    >
      {icon && <div className="card-icon">{icon}</div>}

      {title && <h3 className="card-title">{title}</h3>}

      {subtitle && <p className="card-subtitle">{subtitle}</p>}

      {children}
    </header>
  )
})

CardHeader.displayName = 'CardHeader'

export default CardHeader
