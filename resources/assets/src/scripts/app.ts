import './init' // must be first
// import 'admin-lte'
import 'jquery'
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

document.addEventListener('DOMContentLoaded', () => {
  const DekstopClientMedia = window.matchMedia('(min-width: 768px)')

  if (DekstopClientMedia.matches) {
    // Current client is Desktop
    if (localStorage.getItem('LSS/WebUI/Sidebar/Status') == 'closed') {
      document.body.classList.add('sidebar-collapse')
    }
  }

  function toggleSidebarStatusInLocalStorage(status: boolean) {
    DekstopClientMedia.matches &&
      localStorage.setItem(
        'LSS/WebUI/Sidebar/Status',
        status ? 'closed' : 'open',
      )
  }

  let maskElement: JQuery | null
  $('[data-widget="pushmenu"]')?.click(() => {
    const status = document.body.classList.toggle(`sidebar-collapse`)
    maskElement?.remove()
    if (!DekstopClientMedia.matches && status) {
      const mask = $('<div class="content-mask"></div>')
      maskElement = mask

      mask.css({
        position: 'absolute',
        inset: '0',
        'z-index': '5000',
        'border-top-left-radius': 'var(--f-radius)',
      })

      $('.content-wrapper').append(mask)

      mask.on('click', function (e) {
        e.stopPropagation()
        document.body.classList.remove('sidebar-collapse')
        $(this).remove()
      })
    }
    toggleSidebarStatusInLocalStorage(status)
    return void 0
  })
  $('.main-sidebar')?.click(() => {
    document.body.classList.contains('sidebar-collapse') &&
      document.body.classList.remove(`sidebar-collapse`)
    toggleSidebarStatusInLocalStorage(false)
    return void 0
  })
  // 初始化所有树形视图为收起状态
  $('li.nav-item:has(ul.nav-treeview)').each(function () {
    $(this).find('.nav-treeview').hide()
  })

  // 为可展开的导航链接添加点击事件
  $(document).on('click', 'a.nav-link[href="#"]', function (e) {
    e.preventDefault()

    const $navItem = $(this).closest('.nav-item')
    const $treeView = $navItem.find('.nav-treeview')
    const $icon = $(this).find('.right.fas')

    // 切换树形视图显示
    $treeView.toggle()

    // 切换父级元素的展开类
    $navItem.toggleClass('treeview-open')

    // 切换图标旋转
    if ($navItem.hasClass('treeview-open')) {
      $icon.css('transform', 'rotate(-90deg)')
    } else {
      $icon.css('transform', 'rotate(0deg)')
    }
  })
})
