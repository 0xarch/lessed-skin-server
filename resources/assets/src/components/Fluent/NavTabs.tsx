import React from 'react'

interface TabItem {
  type: 'hyperlink' | 'event'
  href?: string
  onClick?: (e: React.MouseEvent) => void
  class?: string
  title: string
}

interface NavTabsProps {
  tabs: TabItem[]
  active: number // index, start from zero
}

const NavTabs: React.FC<NavTabsProps> = ({ tabs, active }) => {
  const handleClick = (e: React.MouseEvent, tab: TabItem) => {
    if (tab.type === 'event' && tab.onClick) {
      e.preventDefault()
      tab.onClick(e)
    }
  }

  return (
    <f-navtabs role="tablist">
      {tabs.map((tab, index) => {
        const isActive = active === index
        const className = `nav-link ${isActive ? 'active' : ''} ${
          tab.class || ''
        }`.trim()

        if (tab.type === 'hyperlink')
          return (
            <f-item key={index} class="nav-item">
              <a href={tab.href || '#'} className={className}>
                {tab.title}
              </a>
            </f-item>
          )

        return (
          <f-item key={index} class="nav-item">
            <a
              href={tab.href || '#'}
              className={className}
              data-toggle="pill"
              role="tab"
              onClick={(e) => handleClick(e, tab)}
            >
              {tab.title}
            </a>
          </f-item>
        )
      })}
    </f-navtabs>
  )
}

export default NavTabs
