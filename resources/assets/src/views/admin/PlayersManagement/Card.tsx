import React from 'react'
import ReactDOM from 'react-dom'
import { t } from '@/scripts/i18n'
import type { Player } from '@/scripts/types'
import { dialog } from 'mdui'

interface Props {
  player: Player
  onUpdateName(): void
  onUpdateOwner(): void
  onUpdateTexture(): void
  onDelete(): void
}

const Card: React.FC<Props> = (props) => {
  const { player } = props

  const handlePreviewTextures = () => {
    const skinPreview = `${blessing.base_url}/preview/${player.tid_skin}`
    const skinPreviewPNG = `${skinPreview}?png`
    const capePreview = `${blessing.base_url}/preview/${player.tid_cape}`
    const capePreviewPNG = `${capePreview}?png`

    const root = document.createElement('div')

    ReactDOM.render(
      <>
        <div className="col-6 d-flex justify-content-center">
          {player.tid_skin > 0 && (
            <a
              href={`${blessing.base_url}/skinlib/show/${player.tid_skin}`}
              target="_blank"
            >
              <picture>
                <source srcSet={skinPreview} type="image/webp" />
                <img
                  src={skinPreviewPNG}
                  alt={`${player.name} - ${t('general.skin')}`}
                  width="128"
                />
              </picture>
            </a>
          )}
        </div>
        <div className="col-6 d-flex justify-content-center">
          {player.tid_cape > 0 && (
            <a
              href={`${blessing.base_url}/skinlib/show/${player.tid_cape}`}
              target="_blank"
            >
              <picture>
                <source srcSet={capePreview} type="image/webp" />
                <img
                  src={capePreviewPNG}
                  alt={`${player.name} - ${t('general.cape')}`}
                  width="128"
                />
              </picture>
            </a>
          )}
        </div>
      </>,
      root,
    )

    dialog({
      headline: t('general.player.previews'),
      body: root,
      closeOnEsc: true,
      closeOnOverlayClick: true,
      onClosed: () => {
        root.remove()
      },
    })
  }

  const avatar = `${blessing.base_url}/avatar/player/${player.name}`
  const avatarPNG = `${avatar}?png`

  return (
    <mdui-card class="mdui-prose" style={{ padding: '1rem' }} variant="filled">
      <header>
        <h4>
          <picture>
            <source srcSet={avatar} type="image/webp" />
            <img src={avatarPNG} style={{ marginTop: 0, height: '1em' }} />
          </picture>
          &nbsp;
          {player.name}
        </h4>
      </header>
      <div>
        <span>PID: {player.pid}</span>
        &nbsp;
        <span>
          {t('general.player.owner')}: {player.uid}
        </span>
      </div>
      <small>
        {`${t('general.player.last-modified')}: `}
        {player.last_modified}
      </small>
      <mdui-divider class="md-br" />
      <footer className="d-flex">
        <mdui-button variant="elevated" onClick={handlePreviewTextures}>
          {t('general.player.previews')}
        </mdui-button>
        &nbsp;
        <mdui-button variant="elevated" onClick={props.onUpdateName}>
          {t('admin.changePlayerName')}
        </mdui-button>
        &nbsp;
        <mdui-dropdown>
          <mdui-button-icon icon="settings" slot="trigger" />
          <mdui-menu>
            <mdui-menu-item onClick={props.onUpdateOwner}>
              {t('admin.changeOwner')}
            </mdui-menu-item>
            <mdui-menu-item onClick={props.onUpdateTexture}>
              {t('admin.changeTexture')}
            </mdui-menu-item>
            <mdui-divider />
            <mdui-menu-item onClick={props.onDelete}>
              {t('admin.deletePlayer')}
            </mdui-menu-item>
          </mdui-menu>
        </mdui-dropdown>
      </footer>
    </mdui-card>
  )
}

export default Card
