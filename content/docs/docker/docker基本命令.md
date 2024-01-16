---
title: "Docker基本命令"
date: 2023-07-24 16:08:09
draft: false
tags:
  - Docker
categories:
  - tech
---

## 基本命令

| 模块        | 功能         | 命令                                                             |
|:--------- |:---------- |:-------------------------------------------------------------- |
| repo      | 登录仓库       | docker login [private repo] -u username -p password            |
| image     | 打包镜像       | docker build . -t name:tag --build-arg VERSION=v1              |
| image     | 拉取镜像       | docker pull [name:tag]                                         |
| image     | 列出所有镜像     | docker images 或 docker image ls                                |
| image     | 删除镜像       | docker image rm [name:tag\|image id]                           |
| image     | 删除所有不使用的镜像 | docker image prune [--force --all \| -f -a]                    |
| container | 列出运行中的容器   | docker container [list\|ls]                                    |
| container | 列出运行中的容器   | docker ps                                                      |
| container | 列出所有容器     | docker container list -a                                       |
| container | 启动容器       | docker run -p 8080:8080 --name test -it [name:tag \| image id] |
| container | 启动容器       | docker start [container name \| container id]                  |
| container | 进入容器       | docker exec [OPTIONS] CONTAINER COMMAND [ARG...]               |
| container | 删除所有停止的容器  | docker container prune -f                                      |

## Dockerfile 打包镜像

[Dockerfiles 项目参考](https://github.com/jessfraz/dockerfiles/blob/master/golinks/Dockerfile)

[参考文档](https://yeasy.gitbook.io/docker_practice/image/build)

### Dockerfile

```Dockerfile
FROM golang:alpine as builder
LABEL maintainer "Jessie Frazelle <jess@linux.com>"

RUN    apk --no-cache add \
    ca-certificates \
    git

ENV PATH /go/bin:/usr/local/go/bin:$PATH
ENV GOPATH /go

RUN go get github.com/kellegous/go || true \
    && cd /go/src/github.com/kellegous/go \
    && go build ./cmd/go \
    && mv go /usr/bin/go


FROM alpine:latest

COPY --from=builder /usr/bin/go /usr/bin/go
COPY --from=builder /etc/ssl/certs/ /etc/ssl/certs

ENTRYPOINT [ "go" ]
```

打包镜像命令

```bash
# Dockerfile所在目录
docker build . -t [name]:[tag]
```

### docker build 传参

```bash
# 通过--build-arg传递参数
docker build . --build-arg VERSION=v0.0.1 --build-arg JOB=appname
```

Dockerfile 中通过${}形式使用参数
**注意：FROM 命令后如果需要使用参数，必须重新声明一次**

```Dockerfile
FROM golang:1.13-alpine
ARG VERSION=v0.0.1
ARG JOB=APP

RUN echo ${VERSION}
RUN echo ${JOB}
```

### 多阶段构建

多阶段构建功能允许我们在构建过程中使用多个临时镜像，但只保留最新的镜像作为最终产物

可以将编译与运行环境分离开，并减少依赖，减小镜像大小

## docker compose [待补充]