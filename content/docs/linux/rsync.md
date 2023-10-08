---
title: "Rsync"
date: 2023-09-25 14:57:39
draft: false
tags: 
- linux
categories:
- tech
---

## rsync code 23

报错：
```bash
rsync files to /home/path/xxx failed, ['could not make way for new regular file: xxx/.git', 'rsync error: some files/attrs were not transferred (see previous errors) (code 23) at main.c(1039)']
```

原因：

服务器上.git是个目录，rsync同步的.git是个文件，导致rsync失败