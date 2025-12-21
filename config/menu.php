<?php
/*
|--------------------------------------------------------------------------
| Sidebar Menus
|--------------------------------------------------------------------------
|
| Register your custom sidebar menu here.
|
*/

$menu['user'] = [
    ['title' => 'general.dashboard',      'link' => 'user',         'icon' => 'fa-tachometer-alt'],
    ['title' => 'general.my-closet',      'link' => 'user/closet',  'icon' => 'fa-star'],
    ['title' => 'general.player-manage',  'link' => 'user/player',  'icon' => 'fa-users'],
    ['title' => 'general.my-reports',     'link' => 'user/reports', 'icon' => 'fa-flag'],
    ['title' => 'general.profile',        'link' => 'user/profile', 'icon' => 'fa-user'],
    // [
    //     'title' => 'general.developer',
    //     'icon' => 'fa-code-branch',
    //     'children' => [
    //         ['title' => 'general.oauth-manage', 'link' => 'user/oauth/manage', 'icon' => 'fa-feather-alt'],
    //     ],
    // ],
];

$menu['admin'] = [
    ['title' => 'general.dashboard',      'link' => 'admin',                'icon' => 'dashboard'],
    ['title' => 'general.user-manage',    'link' => 'admin/users',          'icon' => 'manage_accounts'],
    ['title' => 'general.player-manage',  'link' => 'admin/players',        'icon' => 'gamepad'],
    ['title' => 'general.report-manage',  'link' => 'admin/reports',        'icon' => 'report'],
    ['title' => 'general.customize',      'link' => 'admin/customize',      'icon' => 'dashboard_customize'],
    // ['title' => 'general.i18n',           'link' => 'admin/i18n',           'icon' => 'fa-globe'],
    ['title' => 'general.score-options',  'link' => 'admin/score',          'icon' => 'credit_score'],
    ['title' => 'general.options',        'link' => 'admin/options',        'icon' => 'settings'],
    ['title' => 'general.res-options',    'link' => 'admin/resource',       'icon' => 'image'],
    ['title' => 'general.status',         'link' => 'admin/status',         'icon' => 'query_stats'],
    ['title' => 'general.plugin-manage',  'link' => 'admin/plugins/manage', 'icon' => 'extension'],
    ['title' => 'general.plugin-market',  'link' => 'admin/plugins/market', 'icon' => 'shop'],
    ['title' => 'general.plugin-configs', 'id' => 'plugin-configs',       'icon' => 'extension', 'children' => []],
    // ['title' => 'general.check-update',   'link' => 'admin/update',         'icon' => 'fa-arrow-up'],
];

$menu['explore'] = [
    ['title' => 'general.skinlib',         'link' => 'skinlib',              'icon' => 'fa-archive'],
];

return $menu;
