/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react'
import { useMeasure } from 'react-use'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import * as skinview3d from 'skinview3d'
import { t } from '@/scripts/i18n'
import * as breakpoints from '@/styles/breakpoints'
import SkinSteve from '../../../misc/textures/steve.png'
import bg1 from '../../../misc/backgrounds/1.webp'
import bg2 from '../../../misc/backgrounds/2.webp'
import bg3 from '../../../misc/backgrounds/3.webp'
import bg4 from '../../../misc/backgrounds/4.webp'
import bg5 from '../../../misc/backgrounds/5.webp'
import bg6 from '../../../misc/backgrounds/6.webp'
import bg7 from '../../../misc/backgrounds/7.webp'
import { Card, CardHeader } from './_FluentComponents'

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg7]
export const PICTURES_COUNT = backgrounds.length

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

interface Props {
  skin?: string
  cape?: string
  isAlex: boolean
  showIndicator?: boolean
  initPositionZ?: number
}

const animationFactories = [
  () => new skinview3d.WalkingAnimation(),
  () => new skinview3d.RunningAnimation(),
  () => new skinview3d.FlyingAnimation(),
  () => new skinview3d.IdleAnimation(),
]

const ActionButton = styled.i`
  display: inline;
  padding: 0.5em 0.5em;
  &:hover {
    color: #555;
    cursor: pointer;
  }
`

const cssViewer = css`
  flex: 1 1 auto;
  ${breakpoints.greaterThan(breakpoints.Breakpoint.lg)} {
    min-height: 500px !important;
  }
  min-height: 300px !important;
  width: 100%;
  height: 100%;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    border-radius: var(--f-radius);
  }
`

const Viewer: React.FC<Props> = (props) => {
  const { initPositionZ = 70 } = props

  const viewRef: React.MutableRefObject<skinview3d.SkinViewer> = useRef(null!)
  const containerRef = useRef<HTMLCanvasElement>(null)

  const [paused, setPaused] = useState(false)
  const [animation, setAnimation] = useState(0)
  const [bgPicture, setBgPicture] = useState(-1)

  const indicator = (() => {
    const { skin, cape } = props
    if (skin && cape) {
      return `${t('general.skin')} & ${t('general.cape')}`
    } else if (skin) {
      return t('general.skin')
    } else if (cape) {
      return t('general.cape')
    }
    return ''
  })()

  useEffect(() => {
    const container = containerRef.current!
    const viewer = new skinview3d.SkinViewer({
      canvas: container,
      width: container.clientWidth,
      height: container.clientHeight,
      skin: props.skin || SkinSteve,
      cape: props.cape || undefined,
      model: props.isAlex ? 'slim' : 'default',
      zoom: initPositionZ / 100,
    })
    viewer.autoRotate = true

    if (document.body.classList.contains('dark-mode')) {
      viewer.background = '#6c757d'
    }

    viewRef.current = viewer

    return () => {
      viewer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [containerWrapperRef, containerMeasure] = useMeasure<HTMLDivElement>()
  useEffect(() => {
    viewRef.current.setSize(containerMeasure.width, containerMeasure.height)
  }, [containerMeasure.width, containerMeasure.height])

  useEffect(() => {
    const viewer = viewRef.current
    viewer.loadSkin(props.skin || SkinSteve, {
      model: props.isAlex ? 'slim' : 'default',
    })
  }, [props.skin, props.isAlex])

  useEffect(() => {
    const viewer = viewRef.current
    if (props.cape) {
      viewer.loadCape(props.cape)
    } else {
      viewer.resetCape()
    }
  }, [props.cape])

  useEffect(() => {
    const viewer = viewRef.current
    const factory = animationFactories[animation]
    if (factory === undefined) {
      viewer.animation = null
    } else {
      const newAnimation = factory()
      newAnimation.paused = paused // Perseve `paused` state
      viewer.animation = newAnimation
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation])

  useEffect(() => {
    const currentAnimation = viewRef.current.animation
    if (currentAnimation !== null) {
      currentAnimation.paused = paused
    }
  }, [paused])

  useEffect(() => {
    const viewer = viewRef.current
    const backgroundUrl = backgrounds[bgPicture]
    if (backgroundUrl === undefined) {
      viewer.background = null
    } else {
      viewer.loadBackground(backgroundUrl)
    }
  }, [bgPicture])

  const togglePause = () => {
    setPaused((paused) => {
      if (paused) {
        return false
      } else {
        viewRef.current.autoRotate = false
        return true
      }
    })
  }

  const toggleAnimation = () => {
    setAnimation((index) => (index + 1) % animationFactories.length)
    setPaused(false)
  }

  const toggleRotate = () => {
    const viewer = viewRef.current
    viewer.autoRotate = !viewer.autoRotate
  }

  const toggleBackEquippment = () => {
    const player = viewRef.current.playerObject
    if (player.backEquipment === 'cape') {
      player.backEquipment = 'elytra'
    } else {
      player.backEquipment = 'cape'
    }
  }

  const setPrevPicture = () => {
    setBgPicture((index) => {
      if (bgPicture <= 0) {
        return PICTURES_COUNT - 1
      } else {
        return index - 1
      }
    })
  }
  const setNextPicture = () => {
    setBgPicture((index) => {
      if (bgPicture >= PICTURES_COUNT - 1) {
        return 0
      } else {
        return index + 1
      }
    })
  }

  return (
    // @ts-ignore
    <mdui-card class="md-card mdui-prose">
      <h3>
        {t('general.texturePreview')}
        {props.showIndicator && indicator ? (
          <mdui-badge>{indicator}</mdui-badge>
        ) : (
          ''
        )}
      </h3>
      <div>
        <mdui-button
          icon={paused ? 'play_arrow' : 'paused'}
          onClick={togglePause}
        >
          {paused ? t('general.playAnimation') : t('general.pauseAnimation')}
        </mdui-button>
        <mdui-button-icon icon="run_circle" onClick={toggleAnimation} />
        <mdui-button-icon icon="tablet" onClick={toggleBackEquippment} />
        <mdui-button-icon icon="rotate_right" onClick={toggleRotate} />
        <br />
        <mdui-button
          icon="navigate_before"
          onClick={setPrevPicture}
          variant="tonal"
        >
          {t('colors.prev')}
        </mdui-button>
        &nbsp;
        <mdui-button
          end-icon="navigate_next"
          onClick={setNextPicture}
          variant="tonal"
        >
          {t('colors.next')}
        </mdui-button>
      </div>
      <mdui-divider class="md-br" />
      <div className="card-body" ref={containerWrapperRef} css={cssViewer}>
        <canvas ref={containerRef}></canvas>
      </div>
      <mdui-divider class="md-br" />
      <footer className="d-flex">{props.children}</footer>
    </mdui-card>
  )
}

export default Viewer
