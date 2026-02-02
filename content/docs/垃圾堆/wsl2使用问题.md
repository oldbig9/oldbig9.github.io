---
weight: 100
title: "WSL2问题集"
description: ""
icon: "article"
date: "2025-01-13T16:38:34+08:00"
lastmod: "2025-01-13T16:38:34+08:00"
draft: false
toc: false
tags:
- WSL
categories:
- tech
series:
---

近期申领了新的工作笔记本，系统是windows，目前没有安装双系统，于是打算使用wsl环境进行开发

环境

```
$ wsl --version
WSL 版本： 2.3.26.0
内核版本： 5.15.167.4-1
WSLg 版本： 1.0.65
MSRDC 版本： 1.2.5620
Direct3D 版本： 1.611.1-81528511
DXCore 版本： 10.0.26100.1-240331-1435.ge-release
Windows 版本： 10.0.22631.4602
```

## git拉取代码卡主问题

在git拉取代码时发现拉取代码卡住了，没有报错信息

参考文档[https://github.com/microsoft/WSL/issues/4253](https://github.com/microsoft/WSL/issues/4253)，执行如下命令得到解决

`sudo ifconfig eth0 mtu 1350`

遗憾的是没有在执行命令之前看原来配置是多少，先记录下问题，等有时间再来研究下mtu是个什么东西吧

## 端口无法暴露给局域网问题

wsl2设置了镜像网络模式

参考[https://stackoverflow.com/questions/64513964/wsl-2-which-ports-are-automatically-forwarded](https://stackoverflow.com/questions/64513964/wsl-2-which-ports-are-automatically-forwarded)

1. 防火墙开启端口

    windows防火墙->高级设置->新建入站规则，配置端口

2. netsh设置端口代理

    `netsh interface portproxy add v4tov4 listenport=22 listenaddress=0.0.0.0 connectport=22 connectaddress=localhost`

## wsl2子系统无法启动问题

上周电脑突然崩溃了，没当回事
{{< gallery >}}
<img src="https://oldbig9.github.io/images/20250217.jpg" class="grid-w80" />
{{< /gallery >}}

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
{{< gallery >}}
<img src="https://oldbig9.github.io/images/wsl-1.png" class="grid-w50" />
<img src="https://oldbig9.github.io/images/wsl-2.png" class="grid-w50" />
{{< /gallery >}}