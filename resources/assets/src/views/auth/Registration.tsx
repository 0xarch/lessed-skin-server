import React, { useState, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import useBlessingExtra from '@/scripts/hooks/useBlessingExtra'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { toast } from '@/scripts/notify'
import urls from '@/scripts/urls'
import Alert from '@/components/Alert'
import Captcha from '@/components/Captcha'
import TextInput from '@/components/mdui/text-input'

const Registration: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [nickName, setNickName] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const requirePlayer = useBlessingExtra<boolean>('player')
  const confirmationRef = useRef<HTMLInputElement | null>(null)
  const captchaRef = useRef<Captcha | null>(null)

  useEmitMounted()

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmation(event.target.value)
  }

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(event.target.value)
  }

  const handlePlayerNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPlayerName(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWarningMessage('')

    if (password !== confirmation) {
      setWarningMessage(t('auth.invalidConfirmPwd'))
      confirmationRef.current!.focus()
      return
    }

    setIsPending(true)
    const { code, message } = await fetch.post<fetch.ResponseBody>(
      urls.auth.register(),
      Object.assign(
        { email, password, captcha: await captchaRef.current!.execute() },
        requirePlayer ? { player_name: playerName } : { nickname: nickName },
      ),
    )
    if (code === 0) {
      toast.success(message)
      setTimeout(() => {
        window.location.href = `${blessing.base_url}/user`
      }, 3000)
    } else {
      setWarningMessage(message)
      captchaRef.current!.reset()
    }
    setIsPending(false)
  }

  const emailChangeHandler: React.FormEventHandler<HTMLInputElement> = (
    event,
  ) => {
    // @ts-ignore
    setEmail(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        onChange={emailChangeHandler}
        type="text"
        icon="email"
        label={t('auth.email')}
        required
        autofocus
        value={email}
        variant="outlined"
      />
      <TextInput
        type="password"
        toggle-password
        icon="password"
        onChange={handlePasswordChange}
        required
        label={t('auth.password')}
        autocomplete="new-password"
        value={password}
        variant="outlined"
        minlength={8}
        maxlength={32}
      />
      <TextInput
        type="password"
        toggle-password
        icon="repeat"
        onChange={handleConfirmationChange}
        required
        label={t('auth.repeat-pwd')}
        autocomplete="new-password"
        value={confirmation}
        variant="outlined"
        minlength={8}
        maxlength={32}
        ref={confirmationRef}
      />
      {requirePlayer ? (
        <TextInput
          type="text"
          icon="gamepad"
          onChange={handlePlayerNameChange}
          required
          label={t('auth.player-name')}
          value={playerName}
          variant="outlined"
        />
      ) : (
        <TextInput
          type="text"
          icon="gamepad"
          onChange={handleNickNameChange}
          required
          label={t('auth.nickname')}
          value={nickName}
          variant="outlined"
        />
      )}

      <Captcha ref={captchaRef} />

      <Alert type="warning">{warningMessage}</Alert>

      <footer className="d-flex justify-content-between">
        <mdui-button variant="text" href={`${blessing.base_url}/auth/login`}>
          {t('auth.login-link')}
        </mdui-button>
        <mdui-button loading={isPending} disabled={isPending} type="submit">
          {t('auth.register')}
        </mdui-button>
      </footer>
    </form>
  )
}

export default hot(Registration)
