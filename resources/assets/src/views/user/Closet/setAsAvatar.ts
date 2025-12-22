import { t } from '@/scripts/i18n'
import * as fetch from '@/scripts/net'
import { showModal } from '@/scripts/notify'
import urls from '@/scripts/urls'
import { snackbar, confirm } from 'mdui'

export default async function setAsAvatar(tid: number) {
  try {
    await new Promise((resolve, reject) => {
      confirm({
        headline: t('user.setAvatar'),
        description: t('user.setAvatarNotice'),
        confirmText: t('general.confirm'),
        cancelText: t('general.cancel'),
        onConfirm: resolve,
        onCancel: reject,
        onClose: reject,
      })
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
