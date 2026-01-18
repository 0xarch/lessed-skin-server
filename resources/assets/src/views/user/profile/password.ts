import { post, ResponseBody } from '@/scripts/net'
import { t } from '@/scripts/i18n'
import { toast } from '@/scripts/notify'
import Dialog from '@/scripts/dialog'

export default async function handler(event: Event) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirm') as string

  if (newPassword !== confirmPassword) {
    toast.error(t('auth.invalidConfirmPwd'))
    ;(form.confirm as HTMLInputElement).focus()
    return
  }

  const { code, message }: ResponseBody = await post(
    '/user/profile?action=password',
    {
      current_password: oldPassword,
      new_password: newPassword,
    },
  )
  await Dialog.alert({
    headline: message,
  })
  if (code === 0) {
    window.location.href = `${blessing.base_url}/auth/login`
  }
}
