import React from 'react'
import { t } from '@/scripts/i18n'
import type { Player } from '@/scripts/types'

interface Props {
  player: Player
  onUpdateName(): void
  onUpdateOwner(): void
  onUpdateTexture(): void
  onDelete(): void
}

const Row: React.FC<Props> = (props) => {
  const { player } = props

  return (
    <tr>
      <td>{player.pid}</td>
      <td>
        <mdui-button
          variant="text"
          onClick={props.onUpdateName}
          end-icon="edit"
        >
          {player.name}
        </mdui-button>
      </td>
      <td>
        <mdui-button
          variant="text"
          onClick={props.onUpdateOwner}
          end-icon="edit"
        >
          {player.uid}
        </mdui-button>
      </td>
      <td>
        {player.tid_skin > 0 && (
          <a
            href={`${blessing.base_url}/skinlib/show/${player.tid_skin}`}
            target="_blank"
            className="mr-1"
          >
            <img
              src={`${blessing.base_url}/preview/${player.tid_skin}`}
              alt={`${player.name} - ${t('general.skin')}`}
              width="64"
            />
          </a>
        )}
        {player.tid_cape > 0 && (
          <a
            href={`${blessing.base_url}/skinlib/show/${player.tid_cape}`}
            target="_blank"
          >
            <img
              src={`${blessing.base_url}/preview/${player.tid_cape}`}
              alt={`${player.name} - ${t('general.cape')}`}
              width="64"
            />
          </a>
        )}
      </td>
      <td>{player.last_modified}</td>
      <td>
        <mdui-button variant="tonal" onClick={props.onUpdateTexture}>
          {t('admin.changeTexture')}
        </mdui-button>
        &nbsp;
        <mdui-button
          style={{
            backgroundColor: 'rgb(var(--mdui-color-error-container))',
            color: 'rgb(var(--mdui-color-on-error-container))',
          }}
          onClick={props.onDelete}
        >
          {t('admin.deletePlayer')}
        </mdui-button>
      </td>
    </tr>
  )
}

export default Row
