import React from 'react'
import { t } from '@/scripts/i18n'
import Card from './mdui/card'
import Divider from './mdui/divider'

const ViewerSkeleton: React.FC = () => (
  <Card>
    <h3>{t('general.texturePreview')}</h3>
    <div>
      <mdui-button disabled>{t('general.playAnimation')}</mdui-button>
      &nbsp;
      <mdui-button-icon icon="run_circle" disabled />
      <mdui-button-icon icon="tablet" disabled />
      <mdui-button-icon icon="rotate_right" disabled />
      <br />
      <mdui-button icon="navigate_before" variant="tonal" disabled>
        ...
      </mdui-button>
      &nbsp;
      <mdui-button end-icon="navigate_next" variant="tonal" disabled>
        ...
      </mdui-button>
    </div>
    <Divider />
    <div
      style={{
        overflow: 'hidden',
        aspectRatio: '1.5',
        maxWidth: '50rem',
        margin: '0 auto',
      }}
    ></div>
    <Divider />
    <footer className="d-flex">
      <mdui-button variant="tonal" disabled />
    </footer>
  </Card>
)

export default ViewerSkeleton
