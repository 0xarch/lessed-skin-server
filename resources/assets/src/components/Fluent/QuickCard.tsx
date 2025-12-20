import React, { forwardRef, isValidElement } from 'react'
import { jsx } from '@emotion/react'

// ========== 类型定义 ==========

interface QuickCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  inline?: boolean
}

interface QuickCardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

type QuickCardBodyType = React.ReactElement<QuickCardSectionProps>

interface QuickCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  header?: React.ReactElement<QuickCardSectionProps> | QuickCardHeaderProps
  body?: QuickCardBodyType | QuickCardBodyType[]
  footer?: React.ReactElement<QuickCardSectionProps>
}

// ========== 验证函数 ==========

const isQuickCardHeader = (
  element: React.ReactNode,
): element is React.ReactElement => {
  return isValidElement(element) && element.type === QuickCardHeader
}

const isQuickCardBody = (
  element: React.ReactNode,
): element is React.ReactElement => {
  return isValidElement(element) && element.type === QuickCardBody
}

const isQuickCardFooter = (
  element: React.ReactNode,
): element is React.ReactElement => {
  return isValidElement(element) && element.type === QuickCardFooter
}

// ========== 子组件 ==========

const QuickCardHeader = forwardRef<HTMLDivElement, QuickCardHeaderProps>(
  ({ children, icon, title, subtitle, className, inline, ...props }, ref) => {
    if (children) {
      return jsx('header', { ref, className, ...props }, children)
    }

    const elements: React.ReactNode[] = []

    if (icon) {
      elements.push(
        jsx(
          'div',
          {
            key: 'icon',
            className: 'card-icon',
          },
          icon,
        ),
      )
    }

    if (title) {
      elements.push(
        jsx(
          'h3',
          {
            key: 'title',
            className: 'card-title',
          },
          title,
        ),
      )
    }

    if (subtitle) {
      elements.push(
        jsx(
          'p',
          {
            key: 'subtitle',
            className: 'card-subtitle',
          },
          subtitle,
        ),
      )
    }

    if (elements.length === 0) {
      console.warn(
        'QuickCardHeader 没有提供任何内容（children、icon、title 或 subtitle）',
      )
      return null
    }

    return jsx(
      'header',
      {
        ref,
        className: (className || '') + (inline ? ' inlined' : ''),
        ...props,
      },
      elements,
    )
  },
)

QuickCardHeader.displayName = 'QuickCardHeader'

const QuickCardBody = forwardRef<HTMLDivElement, QuickCardSectionProps>(
  ({ children, className, ...props }, ref) => {
    return jsx('div', { ref, className, ...props }, children)
  },
)
QuickCardBody.displayName = 'QuickCardBody'

const QuickCardFooter = forwardRef<HTMLDivElement, QuickCardSectionProps>(
  ({ children, className, ...props }, ref) => {
    return jsx('div', { ref, className, ...props }, children)
  },
)
QuickCardFooter.displayName = 'QuickCardFooter'

// ========== 主组件 ==========

// @ts-ignore
const QuickCard: ReturnType<
  typeof forwardRef<HTMLDivElement, QuickCardProps>
> & {
  Header: typeof QuickCardHeader
  Body: typeof QuickCardBody
  Footer: typeof QuickCardFooter
} = forwardRef<HTMLDivElement, QuickCardProps>(
  ({ header, body, footer, className, ...props }, ref) => {
    // 验证并渲染 header
    const renderHeader = () => {
      if (!header) return null

      if (!isQuickCardHeader(header)) {
        // 尝试替代QuickCardHeader渲染
        header = jsx(QuickCardHeader, header)
        // throw new Error('header 必须使用 QuickCardHeader 组件')
      }

      return jsx(
        'div',
        {
          className: `card-header ${header.props.className || ''}`.trim(),
          ...header.props,
        },
        header.props.children,
      )
    }

    // 验证并渲染 body
    const renderBody = () => {
      if (!body) {
        return null
        // throw new Error('QuickCard 组件必须包含 body')
      }

      const bodyArray = Array.isArray(body) ? body : [body]

      if (bodyArray.length === 0) {
        return null
        // throw new Error('QuickCard 组件必须包含至少一个 body')
      }

      return bodyArray.map((item, index) => {
        if (!isQuickCardBody(item)) {
          throw new Error('body 的每个元素必须使用 QuickCardBody 组件')
        }

        return jsx(
          'section',
          {
            key: item.key || index,
            className: `card-body ${item.props.className || ''}`.trim(),
            ...item.props,
          },
          item.props.children,
        )
      })
    }

    // 验证并渲染 footer
    const renderFooter = () => {
      if (!footer) return null

      if (!isQuickCardFooter(footer)) {
        throw new Error('footer 必须使用 QuickCardFooter 组件')
      }

      return jsx(
        'div',
        {
          className: `card-footer ${footer.props.className || ''}`.trim(),
          ...footer.props,
        },
        footer.props.children,
      )
    }

    return jsx(
      'div',
      {
        ref,
        className: `fluent-card ${className || ''}`.trim(),
        ...props,
      },
      renderHeader(),
      renderBody(),
      renderFooter(),
    )
  },
)

QuickCard.displayName = 'QuickCard'

QuickCard.Header = QuickCardHeader
QuickCard.Body = QuickCardBody
QuickCard.Footer = QuickCardFooter

export { QuickCard, QuickCardHeader, QuickCardBody, QuickCardFooter }
export default QuickCard
