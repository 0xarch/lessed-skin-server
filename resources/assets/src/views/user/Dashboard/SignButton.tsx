import React from 'react'
import { t } from '@/scripts/i18n'
import * as scoreUtils from './scoreUtils'
import 'mdui/components/button'
import { throttle } from 'mdui'

interface Props {
  isLoading: boolean
  lastSign: Date
  canSignAfterZero: boolean
  signGap: number
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const SignButton: React.FC<Props> = (props) => {
  const { lastSign, signGap, canSignAfterZero } = props
  const remainingTime = scoreUtils.remainingTime(
    lastSign,
    signGap,
    canSignAfterZero,
  )
  const remainingTimeText = scoreUtils.remainingTimeText(remainingTime)
  const canSign = remainingTime <= 0

  const clickEvent = throttle(props.onClick, 300)

  return (
    <mdui-fab
      loading={props.isLoading}
      disabled={!canSign || props.isLoading}
      icon="calendar_today"
      onClick={(event) =>
        clickEvent(
          event as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>,
        )
      }
      extended
    >
      {canSign ? t('user.sign') : remainingTimeText}
    </mdui-fab>
  )
}

export default React.memo(SignButton)
