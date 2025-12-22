import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import useBlessingExtra from '@/scripts/hooks/useBlessingExtra'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import useTexture from '@/scripts/hooks/useTexture'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { showModal } from '@/scripts/notify'
import { Player, TextureType, ScoreInfo } from '@/scripts/types'
import urls from '@/scripts/urls'
import Row from './Row'
import LoadingRow from './LoadingRow'
import Previewer from './Previewer'
import ModalAddPlayer from './ModalAddPlayer'
import ModalReset from './ModalReset'
import { snackbar } from 'mdui'

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState(0)
  const [skin, setSkin] = useTexture()
  const [cape, setCape] = useTexture()
  const [search, setSearch] = useState('')
  const [showModalAddPlayer, setShowModalAddPlayer] = useState(false)
  const [showModalReset, setShowModalReset] = useState(false)
  const playersCount = useBlessingExtra<number>('count')
  const [score, setScore] = useState(0)
  const [playersRate, setPlayersRate] = useState(1)

  useEmitMounted()

  const selectPlayer = (player: Player) => {
    setSelected(player.pid)
    setSkin(player.tid_skin)
    setCape(player.tid_cape)
  }

  useEffect(() => {
    const getPlayers = async () => {
      setIsLoading(true)
      const players = await fetch.get<Player[]>('/user/player/list')
      const scoreData = await fetch.get<ScoreInfo>(urls.user.score())
      setPlayers(players)
      setPlayersRate(scoreData.rate.players)
      setScore(scoreData.user.score)
      if (players.length === 1) {
        selectPlayer(players[0]!)
      }
      setIsLoading(false)
    }
    getPlayers()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleAdd = (player: Player) => {
    setPlayers((players) => [...players, player])
  }

  const editName = async (player: Player, index: number) => {
    let name: string
    try {
      const { value } = await showModal({
        mode: 'prompt',
        text: t('user.changePlayerName'),
        input: player.name,
        validator: (value: string) => {
          if (!value) {
            return t('user.emptyPlayerName')
          }
        },
      })
      name = value
    } catch {
      return
    }

    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.user.player.rename(player.pid),
      { name },
    )
    if (code === 0) {
      snackbar({
        message,
        placement: 'top',
        closeable: true,
      })
      setPlayers((players) => {
        players[index] = { ...player, name }
        return players.slice()
      })
    } else {
      snackbar({
        message,
        placement: 'top',
      })
    }
  }

  const resetTexture = async (skin: boolean, cape: boolean) => {
    if (!skin && !cape) {
      snackbar({
        message: t('user.noClearChoice'),
        placement: 'top',
      })
      return
    }

    // workaround for AliCDN, issue#184
    const search = new URLSearchParams()
    if (skin) {
      search.append('skin', 'true')
    }
    if (cape) {
      search.append('cape', 'true')
    }
    const { code, message } = await fetch.del<fetch.ResponseBody>(
      `${urls.user.player.clear(selected)}?${search.toString()}`,
    )
    if (code === 0) {
      snackbar({
        message,
        placement: 'top',
        closeable: true,
      })
      if (skin) {
        setSkin(0)
      }
      if (cape) {
        setCape(0)
      }
      setPlayers((players) => {
        const index = players.findIndex((player) => player.pid === selected)
        const player = Object.assign({}, players[index])
        if (skin) {
          player.tid_skin = 0
        }
        if (cape) {
          player.tid_cape = 0
        }
        players[index] = player
        return players.slice()
      })
    } else {
      snackbar({
        message,
        placement: 'top',
      })
    }
  }

  const deletePlayer = async (player: Player) => {
    try {
      await showModal({
        title: t('user.deletePlayer'),
        text: t('user.deletePlayerNotice'),
        okButtonType: 'danger',
      })
    } catch {
      return
    }

    const { code, message } = await fetch.del<fetch.ResponseBody>(
      urls.user.player.delete(player.pid),
    )
    if (code === 0) {
      snackbar({
        message,
        placement: 'top',
        closeable: true,
      })
      const { pid } = player
      setPlayers((players) => players.filter((player) => player.pid !== pid))
    } else {
      snackbar({
        message,
        placement: 'top',
      })
    }
  }

  const openModalAddPlayer = () => setShowModalAddPlayer(true)
  const closeModalAddPlayer = () => setShowModalAddPlayer(false)

  const openModalReset = () => setShowModalReset(true)
  const closeModalReset = () => setShowModalReset(false)

  return (
    <>
      <mdui-card class="md-card mdui-prose">
        <mdui-text-field
          type="text"
          placeholder={t('user.typeToSearch')}
          onChange={handleSearch}
        />
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>PID</th>
              <th>{t('general.player.player-name')}</th>
              <th style={{ width: '50%' }}>{t('user.player.operation')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              new Array(playersCount)
                .fill(null)
                .map((_, i) => <LoadingRow key={i} />)
            ) : players.length === 0 ? (
              <tr>
                <td className="text-center" colSpan={3}>
                  {t('general.noResult')}
                </td>
              </tr>
            ) : (
              players
                .filter(({ name }) => name.includes(search))
                .map((player, i) => (
                  <Row
                    key={player.pid}
                    player={player}
                    selected={selected === player.pid}
                    onClick={() => selectPlayer(player)}
                    onEditName={() => editName(player, i)}
                    onReset={openModalReset}
                    onDelete={deletePlayer}
                  />
                ))
            )}
          </tbody>
        </table>
        {playersCount >= score / playersRate ? null : (
          <div className="card-footer">
            <mdui-button
              variant="tonal"
              icon="add"
              onClick={openModalAddPlayer}
            >
              {t('user.player.add-player')}
            </mdui-button>
          </div>
        )}
      </mdui-card>

      <Previewer
        skin={skin.url}
        cape={cape.url}
        isAlex={skin.type === TextureType.Alex}
      />
      <ModalAddPlayer
        show={showModalAddPlayer}
        onAdd={handleAdd}
        onClose={closeModalAddPlayer}
      />
      <ModalReset
        show={showModalReset}
        onSubmit={resetTexture}
        onClose={closeModalReset}
      />
    </>
  )
}

export default hot(Players)
