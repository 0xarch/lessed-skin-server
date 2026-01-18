import Dialog from '@/scripts/dialog'
import { post, ResponseBody } from '@/scripts/net'

export default async function handler(event: Event) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const email: string = formData.get('email') as string
  const password: string = formData.get('password') as string

  const { code, message }: ResponseBody = await post(
    '/user/profile?action=email',
    {
      email,
      password,
    },
  )
  await Dialog.alert({
    headline: message,
  })
  if (code === 0) {
    window.location.href = `${blessing.base_url}/auth/login`
  }
}
