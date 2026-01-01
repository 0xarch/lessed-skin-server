import React from 'react'
import { t } from '@/scripts/i18n'
import type { Plugin } from './types'

interface Props {
  plugin: Plugin
  isInstalling: boolean
  onInstall(): void
  onUpdate(): void
}

const Row: React.FC<Props> = (props) => {
  const { plugin, isInstalling } = props

  const allDeps = Object.entries(plugin.dependencies.all)
  const unsatisfied = Object.keys(plugin.dependencies.unsatisfied)

  return (
    <tr>
      <td style={{ width: '18%' }}>
        <div>
          <b>{plugin.title}</b>
        </div>
        <div>{plugin.name}</div>
      </td>
      <td style={{ width: '37%' }}>{plugin.description}</td>
      <td>{plugin.author}</td>
      <td>{plugin.version}</td>
      <td style={{ width: '100px' }}>
        {allDeps.length === 0 ? (
          <i>{t('admin.noDependencies')}</i>
        ) : (
          allDeps.map(([name, constraint]) => {
            return (
              <mdui-chip key={name} disabled={unsatisfied.includes(name)}>
                {name}: {constraint}
              </mdui-chip>
            )
          })
        )}
      </td>
      <td style={{ width: '12%' }}>
        {plugin.can_update ? (
          <mdui-button
            loading={isInstalling}
            onClick={props.onUpdate}
            icon="update"
            variant="text"
          >
            {t('admin.updatePlugin')}
          </mdui-button>
        ) : (
          <mdui-button
            className="btn btn-default"
            disabled={props.isInstalling || !!plugin.installed}
            onClick={props.onInstall}
            icon="download"
            loading={isInstalling}
            variant="text"
          >
            {plugin.installed
              ? t('admin.updatePlugin')
              : t('admin.installPlugin')}
          </mdui-button>
        )}
      </td>
    </tr>
  )
}

export default Row
