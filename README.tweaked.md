# Lessed Skin 修改一览

## 样式

放弃了 admin-lte，自行实现主题样式，实现基于浏览器原生的亮暗色模式自动切换。此外，还基于新主题略微调整了元素排版。

## Docker

额外打包了 phpMyAdmin 用于可视化数据库管理。并调整了网络设置使应用可以从本地网络直接访问。
端口一览：

- 3306：MariaDB
- 3399：phpMyAdmin
- 8080: 皮肤站

## 构建

如果存在 .env 文件，则不会创建指向 .devcontainer/.env.devcontainer 的链接，方便测试本地部署时的隐私设置（如测试邮箱服务等）。

## 其他事项

如果在使用 Yggdrasil Connect (重构版) 时启用了“禁用 Yggdrasil API 的 Auth Server”后无法访问配置页面，请修改 `plugins/yggdrasil-connect/src/Controllers/ConfigController.php` 的第 82 行附近：

```php
// 修复代码
if (!option('ygg_disable_authserver')) {
    if (empty($client)) {
        $yggcForm->addMessage(trans('LittleSkin\YggdrasilConnect::config.yggc.disable_authserver.empty-client-id'), 'danger');
    } elseif (!$client->firstParty()) {
        $yggcForm->addMessage(trans('LittleSkin\YggdrasilConnect::config.yggc.disable_authserver.invalid-client-id'), 'danger');
    }
}

// 原代码
// if (!option('ygg_disable_authserver') && empty($client)) {
//     $yggcForm->addMessage(trans('LittleSkin\\YggdrasilConnect::config.yggc.disable_authserver.empty-client-id'), 'danger');
// } elseif (!$client->firstParty()) {
//     $yggcForm->addMessage(trans('LittleSkin\\YggdrasilConnect::config.yggc.disable_authserver.invalid-client-id'), 'danger');
// }
```
