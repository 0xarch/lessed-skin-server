import resetAvatar from './resetAvatar'
import passwordFormHandler from './password'
import nicknameFormHandler from './nickname'
import emailFormHandler from './email'
import deleteAccountFormHandler from './deleteAccount'
import { Dialog } from 'mdui'

const btnResetAvatar = document.querySelector('#reset-avatar')
btnResetAvatar?.addEventListener('click', resetAvatar)

const passwordForm = document.querySelector<HTMLFormElement>('#change-password')
passwordForm?.addEventListener('submit', passwordFormHandler)

const nicknameForm = document.querySelector<HTMLFormElement>('#change-nickname')
nicknameForm?.addEventListener('submit', nicknameFormHandler)

const emailForm = document.querySelector<HTMLFormElement>('#change-email')
emailForm?.addEventListener('submit', emailFormHandler)

const deleteAccountForm = document.querySelector<HTMLFormElement>(
  '#modal-delete-account-form',
)
deleteAccountForm?.addEventListener('submit', deleteAccountFormHandler)

const deleteAccountDialog = document.querySelector<Dialog>(
  '#modal-delete-account',
)

const deleteAccountButton = document.getElementById(
  'modal-delete-account-trigger',
)
deleteAccountButton?.addEventListener('click', () => {
  if (deleteAccountDialog) {
    deleteAccountDialog.open = true
  }
})
