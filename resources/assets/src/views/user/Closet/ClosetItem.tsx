import React from 'react'
import { t } from '@/scripts/i18n'
import type { ClosetItem as ClosetItemType } from '@/scripts/types'
import setAsAvatar from './setAsAvatar'
import { DropdownButton } from './styles'
import styled from '@emotion/styled'
import { Card } from '@/components/_FluentComponents'

interface Props {
  item: ClosetItemType
  selected: boolean
  onClick(item: ClosetItemType): void
  onRename(): void
  onRemove(): void
}

const Img = styled.img`
  max-width: 100%;
  max-height: 150px;
`

const ClosetItem: React.FC<Props> = (props) => {
  const { item } = props
  const preview = `${blessing.base_url}/preview/${item.tid}?height=150`
  const previewPNG = `${preview}&png`

  const handleItemClick = () => {
    props.onClick(item)
  }

  const handleSetAsAvatar = () => setAsAvatar(item.tid)

  return (
    <mdui-card class="md-short-card">
      <div onClick={handleItemClick}>
        <picture>
          <source srcSet={preview} type="image/webp" />
          <Img src={previewPNG} alt={item.pivot.item_name} />
        </picture>
      </div>
      <footer>
        <div className="container d-flex justify-content-between">
          <span className="text-truncate" title={item.pivot.item_name}>
            {item.pivot.item_name}
          </span>
          <span>
            <mdui-dropdown>
              <mdui-button-icon icon="more_vert" slot="trigger" />
              <mdui-menu>
                <mdui-menu-item onClick={props.onRename}>
                  {t('user.renameItem')}
                </mdui-menu-item>
                <mdui-menu-item onClick={props.onRemove}>
                  {t('user.removeItem')}
                </mdui-menu-item>
                <mdui-menu-item
                  href={`${blessing.base_url}/skinlib/show/${item.tid}`}
                  target="_blank"
                >
                  {t('user.viewInSkinlib')}
                </mdui-menu-item>
                <mdui-menu-item onClick={handleSetAsAvatar}>
                  {t('user.setAsAvatar')}
                </mdui-menu-item>
              </mdui-menu>
            </mdui-dropdown>
          </span>
        </div>
      </footer>
    </mdui-card>
  )
}

export default ClosetItem
