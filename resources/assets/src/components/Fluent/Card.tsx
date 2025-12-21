import React, { isValidElement, Children, forwardRef } from 'react'
import { jsx } from '@emotion/react'
import CardHeader from './CardHeader'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => {
    const childrenArray = Children.toArray(children)

    let headerElement: React.ReactElement | null = null
    const bodyElements: React.ReactElement[] = []
    const normalBodyElements: React.ReactElement[] = []
    let footerElement: React.ReactElement | null = null

    Children.forEach(childrenArray, (child) => {
      if (!isValidElement(child)) return

      const elementType = child.type as keyof JSX.IntrinsicElements

      if (elementType === 'header' || child.type == CardHeader) {
        headerElement = child
      } else if (elementType === 'footer') {
        footerElement = child
      } else if (elementType === 'body') {
        bodyElements.push(child)
      } else {
        normalBodyElements.push(child)
      }
    })

    headerElement = headerElement!
    footerElement = footerElement!

    return jsx(
      'div',
      {
        className: `fluent-card ${props.className}`,
        ...props,
        ref,
      },

      headerElement &&
        (headerElement.type == CardHeader
          ? headerElement
          : jsx(
              'header',
              {
                className: `card-header ${
                  headerElement.props.className || ''
                }`.trim(),
                ...headerElement.props,
              },
              headerElement.props.children,
            )),

      bodyElements.map((body, index) =>
        jsx(
          'section',
          {
            key: body.key || index,
            className: `card-body ${body.props.className || ''}`.trim(),
            ...body.props,
          },
          body.props.children,
        ),
      ),

      normalBodyElements,

      footerElement &&
        jsx(
          'footer',
          {
            className: `card-footer ${
              footerElement.props.className || ''
            }`.trim(),
            ...footerElement.props,
          },
          footerElement.props.children,
        ),
    )
  },
)

export default Card
