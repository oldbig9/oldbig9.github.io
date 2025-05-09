---
weight: 100
title: "Ollama本地化部署大模型"
description: ""
icon: "article"
date: "2025-02-27T16:12:25+08:00"
lastmod: "2025-02-27T16:12:25+08:00"
draft: true
toc: true
tags:
- ai
categories:
- tech
series:
---

进入[ollama官网](https://ollama.com/)下载，支持linux、macos、windows，平台兼容性很好

安装完成之后，拉取大模型也很方便[https://ollama.com/search](https://ollama.com/search)搜索模型，例如想使用deepseek-r1:1.5b，只需要执行以下命令：

`ollama run deepseek-r1:1.5b`

模型下载完成后就可以开启对话了

浏览器可以安装`page assist`插件，chrome、firefox都可以

不过运行大模型对机器配置要求比较高，小模型回答也没那么准确，ultra7+32G内存响应很慢，甚至出现了答非所问的情况

