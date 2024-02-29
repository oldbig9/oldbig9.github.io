---
weight: 999
title: "Docker开发环境搭建"
description: ""
icon: "article"
date: "2024-01-29T06:40:17Z"
lastmod: "2024-01-29T06:40:17Z"
draft: false
tags:
- Docker
- Hugo
categories:
- tech
series:
- Hugo
---

由于工作中 go 开发环境是 1.17，但 hugo 博客需要 go1.20 以上版本，所以打算搭建个简单的 docker 容器用于博客本地站点的部署环境，简单写了以下 Dockerfile

## Dockerfile

```dockerfile
FROM golang:1.20-alpine

# install hugo extended edition
# maybe install hugo via go install instead and you can specify hugo version
# but you need to change PATH definition or change the entrypoint
# CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
RUN apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community hugo
RUN apk add --no-cache git

VOLUME  /site
WORKDIR /site

# git config
RUN git config --global --add safe.directory /site

EXPOSE 1313/tcp

ENTRYPOINT ["hugo", "server", "-D", "--bind", "0.0.0.0"]
```

> 注意 ENTRYPOINT 中 hugo 命令须增加参数`--bind 0.0.0.0`，否则宿主机无法访问
> 因为hugo启动的服务绑定的localhost和127.0.0.1是容器本身，而非宿主机，所以需要使用--bind参数

打包镜像

```bash
docker build . -t hugo:v1
```

运行容器，最好指定 docker 容器运行用户(-u 参数)，不然容器中创建的文件在宿主机中存在权限问题，因为 docker 默认运行用户是 root

```bash
docker run -it -p 1313:1313 -u $(id -u):$(id -g) -v $(pwd):/site --name hugo hugo:v1
```

参考文档：

- [https://gohugo.io/installation/linux/](https://gohugo.io/installation/linux/)
- [https://github.com/gohugoio/hugo](https://github.com/gohugoio/hugo)
- [hugo-server-in-docker-container-not-reachable-in-windows-10](https://stackoverflow.com/questions/59008572/hugo-server-in-docker-container-not-reachable-in-windows-10)