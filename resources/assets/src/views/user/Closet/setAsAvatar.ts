import Dialog from '@/scripts/dialog'
import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import urls from '@/scripts/urls'
import { snackbar } from 'mdui'

export default async function setAsAvatar(tid: number) {
  try {
    await Dialog.confirm({
      headline: t('user.setAvatar'),
      description: t('user.setAvatarNotice'),
    })
  } catch {
    return
  }

  const { code, message } = await fetch.post<fetch.ResponseBody>(
    urls.user.profile.avatar(),
    { tid },
  )
  if (code === 0) {
    snackbar({
      message,
      placement: 'top',
    })
    document
      .querySelectorAll<HTMLImageElement>('[alt="User Image"]')
      .forEach((el) => {
        el.src = `${blessing.base_url}/avatar/${tid}`
      })
  } else {
    snackbar({
      message,
      placement: 'top',
    })
  }
}
