// alias for confirm with options
import { alert, confirm, dialog, prompt, RadioGroup } from 'mdui'
import { t } from './i18n'
import { render, unmountComponentAtNode } from 'react-dom'
import { createRef } from 'react'

type RadioDialogOptions = {
  choices?: {
    value: string
    text: string
  }[]
}

export default class Dialog {
  static async confirm(
    options: Parameters<typeof confirm>[0] = {},
  ): Promise<void> {
    return confirm({
      closeOnEsc: true,
      closeOnOverlayClick: true,
      confirmText: t('general.confirm'),
      cancelText: t('general.cancel'),
      ...options,
    })
  }

  static async prompt<T extends string | number = string>(
    options: Parameters<typeof prompt>[0] = {},
  ): Promise<T> {
    return prompt({
      closeOnEsc: true,
      closeOnOverlayClick: true,
      confirmText: t('general.confirm'),
      cancelText: t('general.cancel'),
      ...options,
    }) as Promise<unknown> as Promise<T>
  }

  static async alert(options: Parameters<typeof alert>[0]): Promise<void> {
    return alert({
      closeOnEsc: true,
      closeOnOverlayClick: true,
      confirmText: t('general.confirm'),
      ...options,
    })
  }

  // own-implemented
  static async radio(
    options: Parameters<typeof dialog>[0] & RadioDialogOptions = {},
  ): Promise<string> {
    let value = ''
    // let {promise, resolve, reject} = Promise.withResolvers(); // cannot use below es2024
    let resolve: (value: unknown) => void, reject: (value: unknown) => void

    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })

    const root = document.createElement('div')
    const radioRef = createRef<RadioGroup>()

    const cleanup = () => {
      unmountComponentAtNode(root)
      root.remove()
    }

    render(
      <>
        <mdui-radio-group ref={radioRef}>
          {options.choices?.map?.((choice) => (
            <mdui-radio value={choice.value}>{choice.text}</mdui-radio>
          ))}
        </mdui-radio-group>
      </>,
      root,
    )

    if (radioRef.current) {
      radioRef.current.addEventListener('change', () => {
        if (radioRef.current) {
          value = radioRef.current.value
        }
      })
    }

    dialog({
      closeOnEsc: true,
      closeOnOverlayClick: true,
      onClosed: (dialog) => {
        cleanup()
        options?.onClosed?.(dialog)
      },
      body: root,
      actions: [
        {
          text: t('general.cancel'),
          onClick(dialog) {
            dialog.open = false
            reject('')
          },
        },
        {
          text: t('general.confirm'),
          onClick(dialog) {
            dialog.open = false
            resolve('')
          },
        },
      ],
      ...options,
    })

    await promise

    return value
  }
}
