import { t } from '@/scripts/i18n'
import type { Player } from '@/scripts/types'

interface Props {
  player: Player
  selected: boolean
  onClick: React.MouseEventHandler
  onEditName(player: Player): Promise<void>
  onReset(): void
  onDelete(player: Player): Promise<void>
}

const Row: React.FC<Props> = (props) => {
  const { player } = props

  const handleEdit = () => {
    props.onEditName(player)
  }

  const handleDelete = () => {
    props.onDelete(player)
  }

  return (
    <tr onClick={props.onClick}>
      <td>{player.pid}</td>
      <td>
        <mdui-button variant="text" end-icon="edit" onClick={handleEdit}>
          {player.name}
        </mdui-button>
      </td>
      <td>
        <mdui-button variant="text" onClick={props.onReset}>
          {t('user.player.delete-texture')}
        </mdui-button>
        <mdui-button
          variant="text"
          onClick={handleDelete}
          style={{
            backgroundColor: '--mdui-color-error',
            color: '--mdui-color-on-error',
          }}
        >
          {t('user.player.delete-player')}
        </mdui-button>
      </td>
    </tr>
  )
}

export default Row
