import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import NotificationsList from '@/views/widgets/NotificationsList'

export type Notification = {
  id: string
  title: string
}

const mduiNotificationContainer = $('#notifications_container')?.[0]
if (mduiNotificationContainer) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      handleMDUINotifications(mduiNotificationContainer)
    })
  } else {
    handleMDUINotifications(mduiNotificationContainer)
  }
}

function handleMDUINotifications(notificationContainer: HTMLElement) {
  const dataset = notificationContainer.dataset
  const notifications: Notification[] = JSON.parse(dataset.notifications!)
  const noUnreadText: string = dataset.t!
  ReactDOM.render(
    <NotificationsList
      notifications={notifications}
      noUnreadText={noUnreadText}
    />,
    notificationContainer,
  )
}
