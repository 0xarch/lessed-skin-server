import React, { useState, useRef, useEffect } from 'react'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { toast } from '@/scripts/notify'
import type { Player } from '@/scripts/types'
import urls from '@/scripts/urls'
import { Dialog } from 'mdui'
import Divider from '@/components/mdui/divider'

type Extra = {
  score: number
  cost: number
  rule: string
  length: string
}

interface Props {
  show: boolean
  onAdd(player: Player): void
  onClose(): void
}

const ModalAddPlayer: React.FC<Props> = (props) => {
  const [name, setName] = useState('')

  const { rule, length } = blessing.extra as Extra

  const modalRef = useRef<Dialog>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleConfirm = async () => {
    const {
      code,
      message,
      data: player,
    } = await fetch.post<fetch.ResponseBody<Player>>(urls.user.player.add(), {
      name,
    })
    if (code === 0) {
      toast.success(message)
      props.onAdd(player)
      modalRef.current && (modalRef.current.open = false)
    } else {
      toast.error(message)
    }
  }

  const handleClose = () => {
    setName('')
    props.onClose()
  }

  useEffect(() => {
    const dialog = modalRef.current
    dialog?.addEventListener('close', () => {
      handleClose()
      dialog.open = false
    })
    const text = inputRef.current
    text?.addEventListener('change', () => {
      setName(text.value)
    })
  })

  return (
    <mdui-dialog
      open={props.show}
      headline={t('user.player.add-player')}
      close-on-esc
      close-on-overlay-click
      ref={modalRef}
    >
      <mdui-text-field
        label={t('general.player.player-name')}
        id="new-player-name"
        value={name}
        ref={inputRef}
      />
      <Divider />
      <mdui-card variant="outlined">
        <li>{rule}</li>
        <li>{length}</li>
      </mdui-card>
      <Divider />
      <mdui-button slot="action" variant="text" onClick={handleClose}>
        {t('general.cancel')}
      </mdui-button>
      <mdui-button slot="action" onClick={handleConfirm}>
        {t('general.confirm')}
      </mdui-button>
    </mdui-dialog>
  )
}

export default ModalAddPlayer
