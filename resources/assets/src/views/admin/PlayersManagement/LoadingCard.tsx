import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { t } from '@/scripts/i18n'

const LoadingCard: React.FC = () => (
  <mdui-card class="mdui-prose" style={{ padding: '1rem' }} variant="filled">
    <header>
      <h4>
        <Skeleton circle height="1em" width="1em" />
        &nbsp;
        <Skeleton />
      </h4>
    </header>
    <div>
      <span>PID:</span>
      &nbsp;
      <span>{t('general.player.owner')}:</span>
    </div>
    <small>{`${t('general.player.last-modified')}: `}</small>
    <mdui-divider class="md-br" />
    <footer className="d-flex">
      <mdui-button variant="elevated" loading>
        {t('general.player.previews')}
      </mdui-button>
      &nbsp;
      <mdui-button variant="elevated" loading>
        {t('admin.changePlayerName')}
      </mdui-button>
      &nbsp;
      <mdui-dropdown>
        <mdui-button-icon loading slot="trigger" />
      </mdui-dropdown>
    </footer>
  </mdui-card>
)

export default LoadingCard
