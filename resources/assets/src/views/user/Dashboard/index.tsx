import React, { useState, useEffect, useCallback } from 'react'
import { hot } from 'react-hot-loader/root'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import useTween from '@/scripts/hooks/useTween'
import urls from '@/scripts/urls'
import InfoBox from './InfoBox'
import SignButton from './SignButton'
import * as scoreUtils from './scoreUtils'
import { ScoreInfo } from '@/scripts/types'
import { Dialog, snackbar } from 'mdui'
import Divider from '@/components/mdui/divider'
import Card from '@/components/mdui/card'

type SignReturn = {
  score: number
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState(0)
  const [storage, setStorage] = useState(0)
  const [score, setScore] = useState(0)
  const [tweenedScore, setTweenedScore] = useTween(0)
  const [playersRate, setPlayersRate] = useState(1)
  const [storageRate, setStorageRate] = useState(1)
  const [lastSign, setLastSign] = useState(new Date())
  const [canSignAfterZero, setCanSignAfterZero] = useState(false)
  const [signGap, setSignGap] = useState(24)

  useEmitMounted()

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true)
      const data = await fetch.get<ScoreInfo>(urls.user.score())
      setPlayers(data.usage.players)
      setStorage(data.usage.storage)
      setTweenedScore(data.user.score)
      setScore(data.user.score)
      setPlayersRate(data.rate.players)
      setStorageRate(data.rate.storage)
      setLastSign(new Date(data.user.lastSignAt))
      setCanSignAfterZero(data.signAfterZero)
      setSignGap(data.signGapTime)
      setLoading(false)
    }
    fetchInfo()
  }, [setTweenedScore])

  const handleSign = useCallback(async () => {
    setLoading(true)
    const { code, message, data } = await fetch.post<
      fetch.ResponseBody<SignReturn>
    >(urls.user.sign())

    if (code === 0) {
      snackbar({
        message,
        placement: 'top',
      })
      setLastSign(new Date())
      setTweenedScore(data.score)
      setScore(data.score)
    } else if (code === 1) {
      const remainingTime = scoreUtils.remainingTime(
        lastSign,
        signGap,
        canSignAfterZero,
      )
      snackbar({
        message: scoreUtils.remainingTimeText(remainingTime),
        placement: 'top',
      })
    } else {
      snackbar({
        message,
        placement: 'top',
      })
    }
    setLoading(false)
  }, [canSignAfterZero, lastSign, setTweenedScore, signGap])

  const handleScoreNotice = () => {
    const noticeDialog = $<Dialog>('#user-modal-score-instruction')?.[0]
    if (noticeDialog) {
      noticeDialog.open = true
    }
  }

  return (
    <>
      <Card>
        <h3>{t('user.cur-score')}</h3>
        <p
          style={{ fontFamily: 'Minecraft', fontSize: '2em' }}
          onClick={handleScoreNotice}
        >
          {~~tweenedScore}
        </p>
        <Divider />
        <div className="d-flex align-items-center">
          <SignButton
            isLoading={loading}
            lastSign={lastSign}
            canSignAfterZero={canSignAfterZero}
            signGap={signGap}
            onClick={handleSign}
          />
          <div style={{ marginLeft: 'auto' }} />
          <mdui-button-icon
            onClick={handleScoreNotice}
            icon="question_mark"
            variant="tonal"
          />
        </div>
      </Card>
      <Divider space-only />
      <div className="d-flex">
        <InfoBox
          color="primary"
          icon="gamepad"
          name={t('user.used.players')}
          used={players}
          unused={score / playersRate}
          unit=""
        />
        <Divider space-only />
        {storage > 1024 ? (
          <InfoBox
            color="primary"
            icon="storage"
            name={t('user.used.storage')}
            used={~~(storage / 1024)}
            unused={~~(score / storageRate / 1024)}
            unit="MB"
          />
        ) : (
          <InfoBox
            color="primary"
            icon="storage"
            name={t('user.used.storage')}
            used={storage}
            unused={score / storageRate}
            unit="KB"
          />
        )}
      </div>
    </>
  )
}

export default hot(Dashboard)
