import React from 'react'
import { t } from '@/scripts/i18n'
import type { ClosetItem as ClosetItemType } from '@/scripts/types'
import setAsAvatar from './setAsAvatar'
import { DropdownButton } from './styles'
import styled from '@emotion/styled'

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
    <f-card>
      <f-card-body onClick={handleItemClick}>
        <picture>
          <source srcSet={preview} type="image/webp" />
          <Img src={previewPNG} alt={item.pivot.item_name} />
        </picture>
      </f-card-body>
      <f-card-footer>
        <div className="container d-flex justify-content-between">
          <span className="text-truncate" title={item.pivot.item_name}>
            {item.pivot.item_name}
          </span>
          <span>
            <DropdownButton
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-cog" />
            </DropdownButton>
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item" onClick={props.onRename}>
                {t('user.renameItem')}
              </a>
              <a href="#" className="dropdown-item" onClick={props.onRemove}>
                {t('user.removeItem')}
              </a>
              <a
                href={`${blessing.base_url}/skinlib/show/${item.tid}`}
                className="dropdown-item"
                target="_blank"
              >
                {t('user.viewInSkinlib')}
              </a>
              <a href="#" className="dropdown-item" onClick={handleSetAsAvatar}>
                {t('user.setAsAvatar')}
              </a>
            </div>
          </span>
        </div>
      </f-card-footer>
    </f-card>
  )
}

export default ClosetItem
