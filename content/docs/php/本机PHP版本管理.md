---
title: "本机PHP版本管理"
date: 2023-02-07 13:24:00
draft: false
tags:
- PHP
categories:
- tech
---

## 本地配置PHP版本管理

环境: wsl ubuntu22.04

1. 安装 software-properties-common
```bash
sudo apt-get install -y software-properties-common
```

2. 添加镜像源
```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
```

3. 安装指定版本PHP
```bash
sudo apt-get install -y php5.6
sudo apt-get install -y php8.2
```

4. 切换PHP版本
```bash
╭─wwf@SK-20210813IYED in ~
╰$ sudo update-alternatives --config php
There are 2 choices for the alternative php (providing /usr/bin/php).

  Selection    Path             Priority   Status
------------------------------------------------------------
  0            /usr/bin/php8.2   82        auto mode
* 1            /usr/bin/php5.6   56        manual mode
  2            /usr/bin/php8.2   82        manual mode

Press <enter> to keep the current choice[*], or type selection number: 0
update-alternatives: using /usr/bin/php8.2 to provide /usr/bin/php (php) in auto mode
╭─wwf@SK-20210813IYED in ~
╰$ php --version
PHP 8.2.2 (cli) (built: Feb  3 2023 09:35:38) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.2.2, Copyright (c) Zend Technologies
    with Zend OPcache v8.2.2, Copyright (c), by Zend Technologies
```

**注：docker是另一个更好的选择**




