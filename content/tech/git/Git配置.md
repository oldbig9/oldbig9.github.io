---
title: "Git配置"
date: 2023-05-19 14:01:49
draft: false
tags:
- Git
categories:
- tech
---

```bash
$ # 查看全局配置
$ git config -l
$ # 编辑全局配置
$ git config --global --edit
$ # 修改git默认编辑器
$ git config --global core.editor vim
$ # 删除全局配置
$ git config --global --unset core.editor
```

## url.\<base\>.insteadOf

`git config --global url."实际请求地址".insteadOf "请求地址"`
