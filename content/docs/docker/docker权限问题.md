---
weight: 100
title: "Docker权限问题"
description: ""
icon: "article"
date: "2024-09-19T08:10:40Z"
lastmod: "2024-09-19T08:10:40Z"
draft: false
toc: true
tags:
- Docker
categories:
- tech
series:
---

进入docker容器后，执行go get命令报错没有权限

```bash
/site $ go get github.com/tomowang/hugo-theme-tailwind@latest
failed to initialize build cache at /.cache/go-build: mkdir /.cache: permission denied
```

解决方案如下
- 对于已经存在的容器，指定用户为root即可，`docker exec -u root -it <container_id> /bin/sh`
- 新建容器时增加privileged=true参数，`docker run -it -p 1313:1313 -u $(id -u):$(id -g) -v $(pwd):/site --privileged=true --name hugoenv hugo-go1.21`

参考：[https://developer.aliyun.com/article/1261527](https://developer.aliyun.com/article/1261527)