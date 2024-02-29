---
weight: 999
title: "Composer管理PHP依赖"
description: ""
icon: "article"
date: "2023-12-29T16:05:42+08:00"
lastmod: "2023-12-29T16:05:42+08:00"
draft: false
---

## 安装 composer

[https://pkg.xyz/#how-to-install-composer](https://pkg.xyz/#how-to-install-composer)

```bash
php -r "copy('https://install.phpcomposer.com/installer', 'composer-setup.php');"

php composer-setup.php

php -r "unlink('composer-setup.php');"
```

或者直接下载composer.phar文件，注意对PHP环境有一定要求

```bash
wget https://install.phpcomposer.com/composer.phar
```

安装完成后注意设置环境变量

## 更换镜像源

全局修改镜像源

```bash
composer config -g repo.packagist composer https://packagist.phpcomposer.com
```

项目内执行下面命令修改局部镜像源

```bash
composer config repo.packagist composer https://packagist.phpcomposer.com
```

也可以手动修改 composer.json

```json
"repositories": {
    "packagist": {
        "type": "composer",
        "url": "https://packagist.phpcomposer.com"
    }
}
```

恢复官方镜像源

```bash
composer config -g --unset repos.packagist
```

## 常用命令

| 命令                    | 描述                                                                  |
| :---------------------- | :-------------------------------------------------------------------- |
| composer list           | 获取帮助信息                                                          |
| composer init           | 初始化                                                                |
| composer install        | 从当前目录读取 composer.json 文件，处理依赖关系，并安装到 vendor 目录 |
| composer update         | 获取依赖最新版本，升级 composer.lock 文件                             |
| composer require        | 添加新的依赖包到 composer.json 并执行更新                             |
| composer search         | 搜索依赖包                                                            |
| composer show           | 列举所有可用依赖包                                                    |
| composer validate       | 检测 composer.json 文件是否有效                                       |
| composer self-update    | 更新 composer 版本                                                    |
| composer create-project | 基于 composer 创建一个新的项目                                        |
| composer dump-autoload  | 在添加新的类和目录映射时更新 autoloader                               |
