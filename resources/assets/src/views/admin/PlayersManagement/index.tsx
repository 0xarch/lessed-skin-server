import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import { useImmer } from 'use-immer'
import useIsLargeScreen from '@/scripts/hooks/useIsLargeScreen'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import type { Player, Paginator } from '@/scripts/types'
import { toast } from '@/scripts/notify'
import urls from '@/scripts/urls'
import Pagination from '@/components/Pagination'
import Card from './Card'
import LoadingCard from './LoadingCard'
import Row from './Row'
import LoadingRow from './LoadingRow'
import ModalUpdateTexture from './ModalUpdateTexture'
import { confirm, prompt, SegmentedButtonGroup } from 'mdui'

const PlayersManagement: React.FC = () => {
  const [players, setPlayers] = useImmer<Player[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const isLargeScreen = useIsLargeScreen()
  const [isTableMode, setIsTableMode] = useState(false)
  const [query, setQuery] = useState('')
  const [textureUpdating, setTextureUpdating] = useState(-1)

  useLayoutEffect(() => {
    if (isLargeScreen) {
      setIsTableMode(true)
    }
  }, [isLargeScreen])

  const getPlayers = async () => {
    setIsLoading(true)
    const { data, last_page }: Paginator<Player> = await fetch.get(
      urls.admin.players.list(),
      {
        q: query,
        page,
      },
    )
    setTotalPages(last_page)
    setPlayers(() => data)
    setIsLoading(false)
  }

  useEffect(() => {
    getPlayers()
  }, [page])

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmitQuery = (event: React.FormEvent) => {
    event.preventDefault()
    getPlayers()
  }

  const handleUpdateName = async (player: Player, index: number) => {
    let name = ''
    try {
      await prompt({
        description: t('admin.changePlayerNameNotice'),
        validator: (value) => value,
        closeOnEsc: true,
        closeOnOverlayClick: true,
        onConfirm: (value) => {
          name = value
        },
        confirmText: t('general.confirm'),
        cancelText: t('general.cancel'),
      })
    } catch {
      return
    }

    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.admin.players.name(player.pid),
      { player_name: name },
    )
    if (code === 0) {
      toast.success(message)
      setPlayers((players) => {
        players[index]!.name = name
      })
    } else {
      toast.error(message)
    }
  }

  const handleUpdateOwner = async (player: Player, index: number) => {
    let uid = 0
    try {
      await prompt({
        description: t('admin.changePlayerOwner'),
        closeOnEsc: true,
        closeOnOverlayClick: true,
        validator: (value) =>
          Number.isInteger(Number(value)) ? true : 'Requires number',
        onConfirm: (value) => {
          uid = Number.parseInt(value)
        },
        confirmText: t('general.confirm'),
        cancelText: t('general.cancel'),
        textFieldOptions: {
          type: 'number',
        },
      })
    } catch {
      return
    }

    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.admin.players.owner(player.pid),
      { uid },
    )
    if (code === 0) {
      toast.success(message)
      setPlayers((players) => {
        players[index]!.uid = uid
      })
    } else {
      toast.error(message)
    }
  }

  const handleCloseModalUpdateTexture = () => setTextureUpdating(-1)

  const handleUpdateTexture = async (type: 'skin' | 'cape', tid: number) => {
    const { code, message } = await fetch.put<fetch.ResponseBody>(
      urls.admin.players.texture(players[textureUpdating]!.pid),
      { type, tid },
    )

    if (code === 0) {
      toast.success(message)
      setPlayers((players) => {
        const field = `tid_${type}` as const
        players[textureUpdating]![field] = tid
      })
    } else {
      toast.error(message)
    }
  }

  const handleDelete = async (player: Player) => {
    try {
      await confirm({
        headline: t('admin.deletePlayerNotice'),
        confirmText: t('general.confirm'),
        cancelText: t('general.cancel'),
      })
    } catch {
      return
    }

    const { code, message } = await fetch.del<fetch.ResponseBody>(
      urls.admin.players.delete(player.pid),
    )
    if (code === 0) {
      setPlayers((players) => players.filter(({ pid }) => pid !== player.pid))
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  const switcherRef = useRef<SegmentedButtonGroup>(null)

  const handleModeChange = (mode: boolean) => {
    setIsTableMode(mode)
    if (!switcherRef.current) return
    switcherRef.current.value = mode ? 'table' : 'card'
  }

  return (
    <mdui-card class="md-card mdui-prose">
      <header
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <form className="input-group" onSubmit={handleSubmitQuery}>
          <mdui-text-field
            value={query}
            onInput={handleQueryChange}
            variant="outlined"
          >
            <mdui-button-icon type="submit" icon="search" slot="end-icon" />
          </mdui-text-field>
        </form>
        <mdui-segmented-button-group
          selects="single"
          value={isTableMode ? 'table' : 'card'}
          ref={switcherRef}
          style={{ marginLeft: 'auto' }}
        >
          <mdui-segmented-button
            value="table"
            end-icon="table_view"
            onClick={() => handleModeChange(true)}
          />
          <mdui-segmented-button
            value="card"
            end-icon="grid_view"
            onClick={() => handleModeChange(false)}
          />
        </mdui-segmented-button-group>
      </header>
      {players.length === 0 && !isLoading ? (
        <h4>{t('general.noResult')}</h4>
      ) : isTableMode ? (
        <table className="table-middle-align">
          <thead>
            <tr>
              <th>PID</th>
              <th>{t('general.player.player-name')}</th>
              <th>{t('general.player.owner')}</th>
              <th>{t('general.player.previews')}</th>
              <th>{t('general.player.last-modified')}</th>
              <th>{t('admin.operationsTitle')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? new Array(10).fill(null).map((_, i) => <LoadingRow key={i} />)
              : players.map((player, i) => (
                  <Row
                    key={player.pid}
                    player={player}
                    onUpdateName={() => handleUpdateName(player, i)}
                    onUpdateOwner={() => handleUpdateOwner(player, i)}
                    onUpdateTexture={() => setTextureUpdating(i)}
                    onDelete={() => handleDelete(player)}
                  />
                ))}
          </tbody>
        </table>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {isLoading
            ? new Array(10).fill(null).map((_, i) => <LoadingCard key={i} />)
            : players.map((player, i) => (
                <Card
                  key={player.pid}
                  player={player}
                  onUpdateName={() => handleUpdateName(player, i)}
                  onUpdateOwner={() => handleUpdateOwner(player, i)}
                  onUpdateTexture={() => setTextureUpdating(i)}
                  onDelete={() => handleDelete(player)}
                />
              ))}
        </div>
      )}
      <footer style={{ marginLeft: 'auto', width: 'fit-content' }}>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </footer>
      <ModalUpdateTexture
        open={textureUpdating > -1}
        onSubmit={handleUpdateTexture}
        onClose={handleCloseModalUpdateTexture}
      />
    </mdui-card>
  )
}

export default hot(PlayersManagement)
