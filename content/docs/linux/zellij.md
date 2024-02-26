---
weight: 999
title: "Zellij"
description: ""
icon: "article"
date: "2024-02-26T11:21:26Z"
lastmod: "2024-02-26T11:21:26Z"
draft: false
toc: true
tags: 
- linux
categories:
- tech
---

tmux替代工具zellij

安装: https://zellij.dev/documentation/installation.html

问题: 复制粘贴问题，pane中复制的文案在其他pane中不可用，在zellij之外也不可用

解决方案：

1. 导出配置文件

    `zellij setup --dump-config > ~/.config/zellij/config.kdl`
2. 修改copy_command配置，将对应环境的配置注掉就可以了

    `vim ~/.config/zellij/config.kdl`
