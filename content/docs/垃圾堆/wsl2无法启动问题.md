---
weight: 100
title: "WSL2无法启动问题"
description: ""
icon: "article"
date: "2025-02-17T11:33:01+08:00"
lastmod: "2025-02-17T11:33:01+08:00"
draft: false
toc: true
tags:
- Windows
- WSL
categories:
- tech
series:
---

上周电脑突然崩溃了，没当回事
![电脑崩溃截图](https://147.pink/images/20250217.jpg)

周一上班wsl系统无法进入，还有一部分代码没有提交（哭死），报错信息如下

```powershell
PS C:\> wsl
无法将磁盘“C:\Program Files\WSL\system.vhd”附加到 WSL2： 系统找不到指定的文件。
错误代码: Wsl/Service/CreateInstance/CreateVm/MountVhd/HCS/ERROR_FILE_NOT_FOUND
```

问题原因很明显，就是system.vhd这个文件莫名其妙的被删掉了，唯一可以确认的是不是我删的

这个文件我也没找到哪里可以下载，网上有方案是从别的电脑拷贝一份文件放在该路径上就可以正常启动，
同事用wsl的比较少，也不太想麻烦别人，网上也没有找到下载该文件的地方；重装wsl也担心已经安装的子系统会丢失；
参考了该[文章](https://blog.csdn.net/qq_37771209/article/details/145475745)，发现wsl安装包可以进行修复；
想来这玩意可能一直不是很稳定，所以微软才提供了**修复**这个选项

1. 去[github](https://github.com/microsoft/WSL/releases)下载wsl release版本
2. 右键安装包->显示更多选项->修复
![操作-1](https://147.pink/images/wsl-1.png)
![操作-2](https://147.pink/images/wsl-2.png)
