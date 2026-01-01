import React from 'react'
import { t } from '@/scripts/i18n'
import type { Plugin } from './types'
import Card from '@/components/mdui/card'
import Divider from '@/components/mdui/divider'
import Switch from '@/components/mdui/switch'

interface Props {
  plugin: Plugin
  onEnable(plugin: Plugin): void
  onDisable(plugin: Plugin): void
  onDelete(plugin: Plugin): void
  baseUrl: string
}

const InfoBox: React.FC<Props> = (props) => {
  const { plugin } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (event.target.checked) {
      props.onEnable(plugin)
    } else {
      props.onDisable(plugin)
    }
  }

  const handleDelete = () => props.onDelete(plugin)

  return (
    <Card>
      <div className="card-icon">
        <i className={`${plugin.icon.faType} fa-${plugin.icon.fa}`} />
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <h3 className="card-title">{plugin.title}</h3>
          <p className="card-subtitle">v{plugin.version}</p>
        </div>
        <Switch checked={plugin.enabled} onChange={handleChange} />
      </div>
      <Divider />
      <p>{plugin.description}</p>
      <footer className="flex-wrap">
        {plugin.enabled && plugin.config && (
          <>
            <mdui-button
              href={`${props.baseUrl}/admin/plugins/config/${plugin.name}`}
              title={t('admin.configurePlugin')}
            >
              {t('admin.configurePlugin')}
            </mdui-button>
            &nbsp;
          </>
        )}
        <mdui-button
          variant="outlined"
          title={t('admin.deletePlugin')}
          onClick={handleDelete}
        >
          {t('admin.deletePlugin')}
        </mdui-button>
        {plugin.readme && (
          <>
            &nbsp;
            <mdui-button
              variant="text"
              href={`${props.baseUrl}/admin/plugins/readme/${plugin.name}`}
              title={t('admin.pluginReadme')}
            >
              {t('admin.pluginReadme')}
            </mdui-button>
          </>
        )}
      </footer>
    </Card>
  )
}

export default InfoBox
