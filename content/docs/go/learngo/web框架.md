---
weight: 100
title: "Go web框架"
description: ""
icon: "article"
date: "2025-09-09T15:22:58+08:00"
lastmod: "2025-09-09T15:22:58+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## gin框架

### 路由实现原理

压缩的前缀树，基数树，它进一步合并了只有一个子节点的节点，减少了树的深度和内存占用

gin为每种HTTP方法维护了一颗独立的基数树，可以首先根据HTTP请求方法快速定位到具体的方法树，大大缩小了搜索范围

net/http默认路由器ServeMux是简单的map[string]HandleFunc