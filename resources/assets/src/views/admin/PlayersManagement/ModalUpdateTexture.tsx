import React, { useEffect, useRef, useState } from 'react'
import { t } from '@/scripts/i18n'
import { Dialog, RadioGroup } from 'mdui'

interface Props {
  open: boolean
  onSubmit(type: 'skin' | 'cape', tid: number): void
  onClose(): void
}

const ModalUpdateTexture: React.FC<Props> = (props) => {
  const [type, setType] = useState<'skin' | 'cape'>('skin')
  const [tid, setTid] = useState('')

  const handleTidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTid(event.target.value)
  }

  const handleConfirm = () => {
    props.onSubmit(type, Number.parseInt(tid))
    setType('skin')
    setTid('')
  }

  const handleClose = () => {
    setType('skin')
    setTid('')
    props.onClose()
  }

  const dialogRef = useRef<Dialog>(null)
  const radioRef = useRef<RadioGroup>(null)

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.addEventListener('close', () => {
        handleClose()
      })
    }
    if (radioRef.current) {
      radioRef.current.addEventListener('change', (e) => {
        // @ts-ignore
        setType(e.target.value as 'skin' | 'cape')
      })
    }
  })

  return (
    <mdui-dialog
      open={props.open}
      headline={t('admin.changeTexture')}
      close-on-esc
      close-on-overlay-click
      ref={dialogRef}
    >
      <mdui-button slot="action" onClick={handleConfirm}>
        {t('general.confirm')}
      </mdui-button>
      <h4>{t('admin.textureType')}</h4>
      <mdui-radio-group
        ref={radioRef}
        value={type === 'skin' ? 'skin' : 'cape'}
      >
        <mdui-radio value="skin">{t('general.skin')}</mdui-radio>
        <mdui-radio value="cape">{t('general.cape')}</mdui-radio>
      </mdui-radio-group>
      <mdui-text-field
        id="update-texture-tid"
        label="TID"
        onInput={handleTidChange}
        value={tid}
        placeholder={t('admin.pidNotice')}
      ></mdui-text-field>
    </mdui-dialog>
  )
}

export default ModalUpdateTexture
