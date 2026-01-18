import React, { useState, useRef, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import useBlessingExtra from '@/scripts/hooks/useBlessingExtra'
import useEmitMounted from '@/scripts/hooks/useEmitMounted'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { showModal } from '@/scripts/notify'
import urls from '@/scripts/urls'
import Alert from '@/components/Alert'
import Captcha from '@/components/Captcha'
import TextInput from '@/components/mdui/text-input'

type SuccessfulResponse = {
  code: 0
  message: string
  data: { redirectTo: string }
}
type FailedResponse = {
  code: number
  message: string
  data: { login_fails: number }
}
type Response = SuccessfulResponse | FailedResponse

function isSuccessfulResponse(
  response: Response,
): response is SuccessfulResponse {
  return response.code === 0
}

const Login: React.FC = () => {
  const [identification, setIdentification] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [hasTooManyFails, setHasTooManyFails] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const ref = useRef<Captcha | null>(null)
  const recaptcha = useBlessingExtra<string>('recaptcha')
  const invisibleRecaptcha = useBlessingExtra<boolean>('invisible')

  useEmitMounted()

  useEffect(() => {
    setHasTooManyFails(blessing.extra.tooManyFails as boolean)
  }, [])

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleRememberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(event.target.checked)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)

    const response = await fetch.post<Response>(urls.auth.login(), {
      identification,
      password,
      keep: remember,
      captcha: hasTooManyFails ? await ref.current!.execute() : undefined,
    })

    if (isSuccessfulResponse(response)) {
      window.location.href = response.data.redirectTo
    } else {
      setWarningMessage(response.message)
      setIsPending(false)
      ref.current?.reset()

      // only notify user if he/she fails too much at the first time
      if (response.data.login_fails > 3 && !hasTooManyFails) {
        setHasTooManyFails(true)
        if (recaptcha) {
          // no need to notify if using invisible recaptcha
          if (!invisibleRecaptcha) {
            showModal({
              mode: 'alert',
              text: t('auth.tooManyFails.recaptcha'),
            })
          }
        } else {
          showModal({
            mode: 'alert',
            text: t('auth.tooManyFails.captcha'),
          })
        }
      }
    }
  }

  const emailChangeHandler: React.FormEventHandler<HTMLInputElement> = (
    event,
  ) => {
    // @ts-ignore
    setIdentification(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        onChange={emailChangeHandler}
        type="text"
        icon="email"
        label={t('auth.identification')}
        required
        autofocus
        value={identification}
        variant="outlined"
      />
      <TextInput
        type="password"
        toggle-password
        icon="password"
        onChange={handlePasswordChange}
        required
        label={t('auth.password')}
        autocomplete="current-password"
        value={password}
        variant="outlined"
      />

      {hasTooManyFails && <Captcha ref={ref} />}

      <Alert type="warning">{warningMessage}</Alert>

      <div className="d-flex justify-content-between align-items-center">
        <mdui-checkbox
          checked={remember}
          onInput={handleRememberChange}
          name="rememberMe"
        >
          {t('auth.keep')}
        </mdui-checkbox>
        <a href={`${blessing.base_url}/auth/forgot`}>{t('auth.forgot-link')}</a>
      </div>

      <footer className="d-flex justify-content-between">
        <mdui-button variant="text" href={`${blessing.base_url}/auth/register`}>
          {t('auth.register-link')}
        </mdui-button>
        <mdui-button loading={isPending} disabled={isPending} type="submit">
          {t('auth.login')}
        </mdui-button>
      </footer>
    </form>
  )
}

export default hot(Login)
