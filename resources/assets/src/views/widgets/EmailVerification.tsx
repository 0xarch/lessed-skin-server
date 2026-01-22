import React, { useState } from 'react'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { toast } from '@/scripts/notify'
import Card from '@/components/mdui/card'

const EmailVerification: React.FC = () => {
  const [isSending, setIsSending] = useState(false)

  const send = async () => {
    setIsSending(true)
    const { code, message } = await fetch.post<fetch.ResponseBody>(
      '/user/email-verification',
    )
    if (code === 0) {
      toast.success(message)
    } else {
      toast.error(message)
    }
    setIsSending(false)
  }

  return (
    <Card>
      <h4>
        <i className="fas fa-envelope"></i> {t('user.verification.title')}
      </h4>
      <p>
        {t('user.verification.message')}
        {isSending ? (
          <>
            <i className="fas fa-spin fa-spinner mr-1"></i>
            {t('user.verification.sending')}
          </>
        ) : (
          <a href="#" onClick={send}>
            {t('user.verification.resend')}
          </a>
        )}
      </p>
    </Card>
  )
}

export default EmailVerification
