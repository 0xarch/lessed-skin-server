import React from 'react'
import { t } from '@/scripts/i18n'
import type { LibraryItem } from './types'
import { humanizeType } from './utils'

interface Props {
  item: LibraryItem
  liked: boolean
  onAdd(texture: LibraryItem): Promise<void>
  onRemove(texture: LibraryItem): Promise<void>
  onUploaderClick(uploader: number): void
}

const Item: React.FC<Props> = (props) => {
  const { item } = props

  const link = `${blessing.base_url}/skinlib/show/${item.tid}`
  const preview = `${blessing.base_url}/preview/${item.tid}?height=150`
  const previewPNG = `${preview}&png`

  const handleUploaderClick = (event: React.MouseEvent) => {
    event.preventDefault()
    props.onUploaderClick(item.uploader)
  }

  const handleHeartClick = (event: React.MouseEvent) => {
    event.preventDefault()
    props.liked ? props.onRemove(item) : props.onAdd(item)
  }

  return (
    <a href={link} target="_blank">
      <mdui-card
        class="md-card mdui-prose"
        variant="outlined"
        style={{ maxWidth: '250px' }}
      >
        <picture>
          <source srcSet={preview} type="image/webp" />
          <img src={previewPNG} alt={item.name} className="card-img-top" />
        </picture>
        <div>
          <div className="skinitem-title d-flex justify-content-between align-items-center">
            <h4 style={{ margin: '0' }}>{item.name}</h4>
            {item.public || <mdui-chip>{t('skinlib.private')}</mdui-chip>}
            <mdui-chip
              onClick={handleHeartClick}
              icon={props.liked ? 'favorite' : 'checkroom'}
            >
              {item.likes}
            </mdui-chip>
          </div>
          <mdui-divider class="md-br" />
          <div
            className="skinitem-uploader d-flex align-items-center"
            style={{ marginLeft: 'auto' }}
          >
            <mdui-chip>{humanizeType(item.type)}</mdui-chip>
            <mdui-chip end-icon="upload" onClick={handleUploaderClick}>
              {item.nickname}
            </mdui-chip>
          </div>
        </div>
      </mdui-card>
    </a>
  )
}

export default Item
