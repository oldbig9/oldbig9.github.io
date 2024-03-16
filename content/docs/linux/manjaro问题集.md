---
weight: 100
title: "Manjaro问题集"
description: ""
icon: "article"
date: "2024-03-16T20:15:50+08:00"
lastmod: "2024-03-16T20:15:50+08:00"
draft: false
tags:
- Manjaro
categories:
- tech
series:
---

## 内核版本太旧导致无法识别u盘

之前ubuntu22.04遇到过无法识别u盘的问题，经过安装exfatprogs后问题解决

现在manjaro也是遇到了该问题，exfatprogs在系统中也已经是安装了的

参考：[https://www.cnblogs.com/jlice/p/9276570.html](https://www.cnblogs.com/jlice/p/9276570.html)

本机安装的内核版本是5.15LTS版本，该内核是2021年10月份发布的，对于滚动更新的manjaro来说可能比较旧了，于是在`manjaro setting`中将内核升级为了6.6.19LTS版本，重启后u盘可以正常识别