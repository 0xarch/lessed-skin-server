import React from 'react'
import ReactDOM from 'react-dom'
import NotificationsList from '@/views/widgets/NotificationsList'
import { t } from '../scripts/i18n'
import $ from 'jquery'

const container = document.querySelector('[data-notifications]')
if (container) {
  ReactDOM.render(<NotificationsList />, container)
} else {
  const mduiNotificationContainer = $('#notifications_container')?.[0]
  if (mduiNotificationContainer) {
    // handle MDUI
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        handleMDUINotifications(mduiNotificationContainer)
      })
    } else {
      handleMDUINotifications(mduiNotificationContainer)
    }
  }
}

async function handleMDUINotifications(notificationContainer: HTMLElement) {
  try {
    const { dialog } = await import('mdui/functions/dialog.js')
    const notificationItems =
      notificationContainer.querySelectorAll('.notification-item')

    console.log(notificationItems)

    notificationItems.forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.preventDefault()
        const notificationId = item.getAttribute('data-notification-id')
        if (!notificationId) return

        try {
          const response = await fetch(
            `/user/notifications/${notificationId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                  document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '',
              },
            },
          )

          if (!response.ok) throw new Error('Network response was not ok')

          const data = await response.json()

          dialog({
            headline: data.title,
            body: data.content,
            actions: [
              {
                text: t('general.confirm'),
                onClick: () => {
                  const badge =
                    notificationContainer.querySelector('mdui-badge')
                  const listItem = item.closest('mdui-list-item')

                  if (listItem) {
                    listItem.remove()
                  }

                  const remainingItems =
                    notificationContainer.querySelectorAll('.notification-item')
                  const notificationCount = remainingItems.length

                  if (badge) {
                    if (notificationCount > 0) {
                      badge.textContent = notificationCount.toString()
                    } else {
                      badge.remove()
                      const button = notificationContainer.querySelector(
                        'mdui-button[slot="trigger"]',
                      )
                      if (button) {
                        button.setAttribute('icon', 'notifications_none')
                      }

                      const list = document.querySelector('mdui-list')
                      if (list && list.children.length === 0) {
                        const noNotifications =
                          document.createElement('mdui-list-item')
                        noNotifications.className =
                          'text-muted text-center no-notifications'
                        noNotifications.textContent =
                          document.querySelector('.no-notifications')
                            ?.textContent || t('user.no-unread')
                        list.appendChild(noNotifications)
                      }
                    }
                  }
                },
              },
            ],
          })
        } catch (error) {
          console.error('Error fetching notification:', error)
          const { alert: errorAlert } = await import('mdui/functions/alert.js')
          errorAlert({
            headline: '错误',
            description: '获取通知详情失败',
            confirmText: '确定',
          })
        }
      })
    })
  } catch (error) {
    console.error('Failed to load MDUI alert function:', error)
  }
}
