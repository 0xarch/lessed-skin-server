import React from 'react'
import { t } from '@/scripts/i18n'
import type { LibraryItem } from './types'
import { humanizeType } from './utils'
import Divider from '@/components/mdui/divider'
import { TextureType } from '@/scripts/types'
import Card from '@/components/mdui/card'

interface Props {
  item: LibraryItem
  liked: boolean
  onAdd(texture: LibraryItem): Promise<void>
  onRemove(texture: LibraryItem): Promise<void>
  onUploaderClick(uploader: number): void
  onTypeClick(type: TextureType): void
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

  const getHandlerForTypeClick = (type: TextureType) => {
    const handleTypeClick = (event: React.MouseEvent) => {
      event.preventDefault()
      props.onTypeClick(type)
    }
    return handleTypeClick
  }

  return (
    <a href={link} target="_blank">
      <Card prose variant="outlined" style={{ maxWidth: '250px' }}>
        <picture>
          <source srcSet={preview} type="image/webp" />
          <img
            src={previewPNG}
            alt={item.name}
            style={{ height: '150px', margin: '0 auto' }}
          />
        </picture>
        <div>
          <h4
            style={{
              margin: '0',
              textWrap: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.name}
          </h4>
          <div style={{ margin: '.25rem 0 .25rem auto', width: 'fit-content' }}>
            {item.public || <mdui-chip>{t('skinlib.private')}</mdui-chip>}
            <mdui-chip
              onClick={handleHeartClick}
              icon={props.liked ? 'favorite' : 'checkroom'}
            >
              {item.likes}
            </mdui-chip>
          </div>
          <Divider />
          <div
            className="d-flex align-items-center"
            style={{ marginLeft: 'auto', width: 'fit-content' }}
          >
            <mdui-chip elevated onClick={getHandlerForTypeClick(item.type)}>
              {humanizeType(item.type)}
            </mdui-chip>
            <mdui-divider vertical />
            <mdui-chip end-icon="upload" onClick={handleUploaderClick}>
              {item.nickname}
            </mdui-chip>
          </div>
        </div>
      </Card>
    </a>
  )
}

export default Item
