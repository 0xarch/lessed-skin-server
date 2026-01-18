import Dialog from '@/scripts/dialog'
import { post, ResponseBody } from '@/scripts/net'

export default async function handler(event: Event) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formData = new FormData(form)
  const nickname: string = formData.get('nickname') as string

  const { code, message }: ResponseBody = await post(
    '/user/profile?action=nickname',
    {
      new_nickname: nickname,
    },
  )
  await Dialog.alert({
    headline: message,
  })
  if (code === 0) {
    document.querySelectorAll('[data-mark="nickname"]').forEach((el) => {
      el.textContent = nickname
    })
  }
}
