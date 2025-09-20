---
weight: 100
title: "Go学习"
description: ""
icon: "article"
date: "2025-07-26T10:39:22+08:00"
lastmod: "2025-07-26T10:39:22+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

# Go

## 1.gpm模型


## 2.gc机制


## 3.defer对性能的影响


## 4.recovery为什么必须要在defer中


## 5.协程对比线程的优势


## 6.channel使用场景，channel底层结构


## 7.go实现连接池


## 8.redis分布式集群底层原理


## 9.协程泄漏的常见原因


## GC周期

- 标记准备（mark setup）：STW：开启写屏障
- 并发标记（concurrent marking）：与用户代码并行执行
- 标记终止（mark termination）：STW，完成标记
- 并发清除（concurrent sweeping）：回收白色对象



