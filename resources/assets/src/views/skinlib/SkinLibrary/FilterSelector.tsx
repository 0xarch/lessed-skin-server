import React from 'react'
import { t } from '@/scripts/i18n'
import { TextureType } from '@/scripts/types'
import type { Filter } from './types'
import { humanizeType } from './utils'

interface Props {
  filter: Filter
  onChange(filter: Filter): void
  slot: string
}

const FilterSelector: React.FC<Props> = (props) => {
  const { filter, onChange } = props

  const handleSkinClick = () => onChange('skin')
  const handleSteveClick = () => onChange(TextureType.Steve)
  const handleAlexClick = () => onChange(TextureType.Alex)
  const handleCapeClick = () => onChange(TextureType.Cape)

  return (
    <mdui-dropdown slot={props.slot}>
      <mdui-button slot="trigger" variant="text" end-icon="arrow_drop_down">
        {humanizeType(filter)}
      </mdui-button>
      <mdui-menu>
        <mdui-menu-item onClick={handleSkinClick}>
          {t('general.skin')}
        </mdui-menu-item>
        <mdui-menu-item onClick={handleSteveClick}>Steve</mdui-menu-item>
        <mdui-menu-item onClick={handleAlexClick}>Alex</mdui-menu-item>
        <mdui-menu-item onClick={handleCapeClick}>
          {t('general.cape')}
        </mdui-menu-item>
      </mdui-menu>
    </mdui-dropdown>
  )
}

export default FilterSelector
