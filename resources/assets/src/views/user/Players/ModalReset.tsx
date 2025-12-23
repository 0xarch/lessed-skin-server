import React, { useEffect, useRef, useState } from 'react'
import { t } from '@/scripts/i18n'
import { Checkbox, Dialog } from 'mdui'

interface Props {
  show: boolean
  onSubmit(skin: boolean, cape: boolean): Promise<void>
  onClose(): void
}

const ModalReset: React.FC<Props> = (props) => {
  const [skin, setSkin] = useState(false)
  const [cape, setCape] = useState(false)

  const modalRef = useRef<Dialog>(null)
  const skinCheckboxRef = useRef<Checkbox>(null)
  const capeCheckboxRef = useRef<Checkbox>(null)

  const handleConfirm = () => {
    props.onSubmit(skin, cape)
  }

  const handleClose = () => {
    setSkin(false)
    setCape(false)
    props.onClose()
  }

  useEffect(() => {
    const dialog = modalRef.current
    if (!dialog) return
    dialog.addEventListener('confirm', () => {
      handleConfirm()
      dialog.open = false
    })
    dialog.addEventListener('close', () => {
      handleClose()
    })

    const skinBox = skinCheckboxRef.current

    skinBox?.addEventListener('change', () => {
      setSkin(skinBox.checked)
    })

    const capeBox = capeCheckboxRef.current

    capeBox?.addEventListener('change', () => {
      setCape(capeBox.checked)
    })
  })

  return (
    <mdui-dialog
      open={props.show}
      headline={t('user.chooseClearTexture')}
      close-on-esc
      close-on-overlay-click
      ref={modalRef}
    >
      <mdui-checkbox checked={skin} ref={skinCheckboxRef}>
        {t('general.skin')}
      </mdui-checkbox>
      <mdui-checkbox checked={cape} ref={capeCheckboxRef}>
        {t('general.cape')}
      </mdui-checkbox>
      <mdui-button slot="action" onClick={handleClose} variant="text">
        {t('general.cancel')}
      </mdui-button>
      <mdui-button slot="action" onClick={handleConfirm}>
        {t('general.confirm')}
      </mdui-button>
    </mdui-dialog>
  )
}

export default ModalReset
