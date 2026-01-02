import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { toast } from '@/scripts/notify'
import urls from '@/scripts/urls'
import Dialog from '@/scripts/dialog'

export default async function removeClosetItem(tid: number): Promise<boolean> {
  try {
    await Dialog.confirm({
      headline: t('user.removeFromClosetNotice'),
    })
  } catch {
    return false
  }

  const { code, message } = await fetch.del<fetch.ResponseBody>(
    urls.user.closet.remove(tid),
  )
  if (code === 0) {
    toast.success(message)
  } else {
    toast.error(message)
  }

  return code === 0
}
