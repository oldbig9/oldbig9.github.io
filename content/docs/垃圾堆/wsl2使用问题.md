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

powershell执行命令将wsl端口暴露给宿主机
`netsh interface portproxy set v4tov4 listenport=8888 listenaddress=0.0.0.0 connectport=8888 connectaddress=$(wsl hostname -I)`
windows ip 本机可以访问相关端口，但局域网其他服务器无法访问该端口，应该还是防火墙问题

增加了入站规则，开放端口仍然不可访问，甚至关闭防火墙也是不可访问