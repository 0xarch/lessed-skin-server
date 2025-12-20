import React from 'react'
import { t } from '@/scripts/i18n'
import { Card } from './_FluentComponents'

const ViewerSkeleton: React.FC = () => (
  <Card>
    <header>
      <div className="d-flex justify-content-between">
        <h3 className="card-title">
          <span>{t('general.texturePreview')}</span>
        </h3>
      </div>
    </header>
    <body />
  </Card>
)

export default ViewerSkeleton
