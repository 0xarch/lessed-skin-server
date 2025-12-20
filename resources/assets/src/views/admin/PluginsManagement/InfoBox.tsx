import React from 'react'
import styled from '@emotion/styled'
import { t } from '@/scripts/i18n'
import type { Plugin } from './types'
import Card from '@/components/Fluent/Card'

const ActionButton = styled.a`
  transition-property: color;
  transition-duration: 0.3s;
  color: #000;
  .dark-mode & {
    color: #fff;
  }
  &:hover {
    color: #999;
  }
  &:not(:last-child) {
    margin-right: 9px;
  }
`

const Description = styled.div`
  font-size: 14px;
`

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
      <header
        style={{
          marginBottom: 'var(--f-content-padding)',
          borderBottom: '.1rem solid var(--outline-light-color)',
        }}
      >
        <span className="card-icon">
          <i className={`${plugin.icon.faType} fa-${plugin.icon.fa}`} />
        </span>
        <div className="d-flex justify-content-between">
          <div>
            <h3 className="card-title">{plugin.title}</h3>
            <p className="card-subtitle">v{plugin.version}</p>
          </div>
          <input
            className="toggle"
            type="checkbox"
            checked={plugin.enabled}
            title={
              plugin.enabled
                ? t('admin.disablePlugin')
                : t('admin.enablePlugin')
            }
            onChange={handleChange}
          />
        </div>
      </header>
      <body>
        <Description className="mt-2 text-truncate" title={plugin.description}>
          {plugin.description}
        </Description>
      </body>
      <footer className="flex-wrap">
        {plugin.readme && (
          <a
            className="btn"
            href={`${props.baseUrl}/admin/plugins/readme/${plugin.name}`}
            title={t('admin.pluginReadme')}
          >
            {t('admin.pluginReadme')}
          </a>
        )}
        {plugin.enabled && plugin.config && (
          <a
            className="btn btn-primary"
            href={`${props.baseUrl}/admin/plugins/config/${plugin.name}`}
            title={t('admin.configurePlugin')}
          >
            {t('admin.configurePlugin')}
          </a>
        )}
        <a
          className="btn btn-danger"
          href="#"
          title={t('admin.deletePlugin')}
          onClick={handleDelete}
        >
          {t('admin.deletePlugin')}
        </a>
      </footer>
    </Card>
  )
}

export default InfoBox
