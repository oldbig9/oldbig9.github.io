---
weight: 100
title: "WSL拉取代码失败问题"
description: ""
icon: "article"
date: "2025-01-13T16:38:34+08:00"
lastmod: "2025-01-13T16:38:34+08:00"
draft: true
toc: true
tags:
- WSL
categories:
- tech
series:
---

近期申领了新的工作笔记本，系统是windows，目前没有安装双系统，于是打算使用wsl环境进行开发。但在git拉取代码时发现拉取代码卡住了，没有报错信息

参考文档[https://github.com/microsoft/WSL/issues/4253](https://github.com/microsoft/WSL/issues/4253)，执行如下命令得到解决

`sudo ifconfig eth0 mtu 1350`

遗憾的是没有在执行命令之前看原来配置是多少，先记录下问题，等有时间再来研究下mtu是个什么东西吧
