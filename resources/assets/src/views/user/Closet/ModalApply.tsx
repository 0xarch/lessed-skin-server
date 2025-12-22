import React, { useState, useEffect, useRef } from 'react'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import type { Player } from '@/scripts/types'
import urls from '@/scripts/urls'
import Loading from '@/components/Loading'
import { Dialog, snackbar } from 'mdui'

const baseUrl = blessing.base_url

interface Props {
  show: boolean
  canAdd: boolean
  skin?: number
  cape?: number
  onClose(): void
}

const ModalApply: React.FC<Props> = (props) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const modalRef = useRef<Dialog>(null)

  useEffect(() => {
    if (!props.show) {
      return
    }

    const getPlayers = async () => {
      setIsLoading(true)
      const players = await fetch.get<Player[]>(urls.user.player.list())
      setPlayers(players)
      setIsLoading(false)
    }
    getPlayers()
  }, [props.show])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleSelect = async (player: Player) => {
    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.user.player.set(player.pid),
      {
        skin: props.skin,
        cape: props.cape,
      },
    )
    if (code === 0) {
      snackbar({
        message,
        placement: 'top',
        closeable: true,
      })
      if (modalRef.current) modalRef.current.open = false
    } else {
      snackbar({
        message,
        placement: 'top',
      })
    }
  }

  useEffect(() => {
    modalRef.current?.addEventListener('close', () => {
      props.onClose()
    })
  })

  return (
    <mdui-dialog
      open={props.show}
      id="modal-apply"
      headline={t('user.closet.use-as.title')}
      ref={modalRef}
      close-on-esc
      close-on-overlay-click
    >
      {isLoading ? (
        <Loading />
      ) : players.length === 0 ? (
        <p>{t('user.closet.use-as.empty')}</p>
      ) : (
        <>
          <mdui-text-field
            variant="outlined"
            end-icon="search"
            onChange={handleSearch}
            placeholder={t('user.typeToSearch')}
          />
          <br />
          {players
            .filter((player) => player.name.includes(search))
            .map((player) => (
              <>
                <br className="md-br" />
                <mdui-button
                  key={player.pid}
                  title={player.name}
                  onClick={() => handleSelect(player)}
                  variant="elevated"
                >
                  <mdui-avatar slot="icon">
                    <picture>
                      <source
                        srcSet={`${baseUrl}/avatar/${player.tid_skin}?3d&size=45`}
                        type="image/webp"
                      />
                      <img
                        src={`${baseUrl}/avatar/${player.tid_skin}?3d&png&size=45`}
                        alt={player.name}
                        width={45}
                        height={45}
                      />
                    </picture>
                  </mdui-avatar>
                  {player.name}
                </mdui-button>
              </>
            ))}
        </>
      )}
    </mdui-dialog>
  )
}

export default ModalApply
