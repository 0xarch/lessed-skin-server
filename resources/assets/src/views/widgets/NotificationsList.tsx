import React, { useState, useEffect } from 'react'
import * as fetch from '@/scripts/net'
import { dialog } from 'mdui'

export type Notification = {
  id: string
  title: string
}

interface Props {
  notifications: Notification[]
  noUnreadText: string
}

const NotificationsList: React.FC<Props> = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [noUnreadText, setNoUnreadText] = useState('')

  useEffect(() => {
    const dataset = document.querySelector<HTMLLIElement>(
      '[data-notifications]',
    )?.dataset
    if (dataset) {
      const notifications: Notification[] = JSON.parse(dataset.notifications!)
      setNotifications(notifications)
      setNoUnreadText(dataset.t!)
    }
  }, [])

  const read = async (id: string) => {
    const { title, content } = await fetch.post<{
      title: string
      content: string
    }>(`/user/notifications/${id}`)

    dialog({
      headline: title,
      body: content,
      closeOnEsc: true,
      closeOnOverlayClick: true,
    })

    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    )
  }

  return (
    <mdui-dropdown>
      <mdui-button
        icon={notifications.length ? 'notifications' : 'notifications_none'}
        variant="text"
        slot="trigger"
      >
        {notifications.length ? (
          <mdui-badge variant="large">{notifications.length}</mdui-badge>
        ) : (
          <small>{noUnreadText}</small>
        )}
      </mdui-button>
      <mdui-menu dense>
        {notifications.length ? (
          notifications.map((notification) => (
            <mdui-menu-item onClick={() => read(notification.id)}>
              {notification.title}
            </mdui-menu-item>
          ))
        ) : (
          <mdui-menu-item>{noUnreadText}</mdui-menu-item>
        )}
      </mdui-menu>
    </mdui-dropdown>
  )
}

export default NotificationsList
