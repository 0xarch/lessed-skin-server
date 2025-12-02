import './init' // must be first
// import 'admin-lte'
import './extra'
import './i18n'
import './net'
import './event'
import './notification'
import './emailVerification'
import './logout'
// import './darkMode'

window.addEventListener('load', () => {
  $('[data-toggle="tooltip"]').tooltip()
})

document.addEventListener('DOMContentLoaded', ()=>{
  $('[data-widget="pushmenu"]')?.click(()=>{
    document.body.classList.toggle(`sidebar-collapse`);
    return void 0;
  })
});
