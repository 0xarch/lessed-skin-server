import React from 'react'
import ReactDOM from 'react-dom'
import Modal, { ModalOptions, ModalResult } from '../components/Modal'
import { confirm } from 'mdui'
import { t } from './i18n'

export function showModal(options: ModalOptions = {}): Promise<ModalResult> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const handleClose = () => {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
    }

    ReactDOM.render(
      <Modal
        {...options}
        show
        center
        onConfirm={resolve}
        onDismiss={reject}
        onClose={handleClose}
      />,
      container,
    )
  })
}

// alias for confirm with options
export function popConfirm(
  options: Parameters<typeof confirm>[0],
): Promise<void> {
  return confirm({
    closeOnEsc: true,
    closeOnOverlayClick: true,
    confirmText: t('general.confirm'),
    cancelText: t('general.cancel'),
    ...options,
  })
}
