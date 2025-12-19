import 'react'

type CustomElementProps<T extends HTMLElement> = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<T>, T>,
  'className'
> & {
  class?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'f-card': CustomElementProps
      'f-card-header': CustomElementProps
      'f-card-body': CustomElementProps
      'f-card-footer': CustomElementProps
      'f-subtitle': CustomElementProps
      'f-navtabs': CustomElementProps
      'f-item': CustomElementProps
    }
  }
}
