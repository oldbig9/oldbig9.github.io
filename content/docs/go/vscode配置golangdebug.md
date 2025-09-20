---
weight: 100
title: "Vscode配置golangdebug"
description: ""
icon: "article"
date: "2025-09-14T09:11:45+08:00"
lastmod: "2025-09-14T09:11:45+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 1.安装Go扩展及相关工具

`Ctrl+Shift+P`执行`Go: Install/Updates Tools`，全选所有工具即可

涉及到debug的是dlv工具，也可以通过`go install github.com/go-delve/delve/cmd/dlv@latest`安装

## 2. 编写要断点执行的demo.go文件

文件编写完成后，打断点，然后F5或单击debug图标进行debug

注意需要配置.vscode/launch.json文件，然后就可以对程序代码进行断点调试了
```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Package",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${fileDirname}"
        }
    ]
}
```
