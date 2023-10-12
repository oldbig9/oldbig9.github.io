---
weight: 999
title: "Go包管理"
description: ""
icon: "article"
date: "2023-10-12T23:00:54+08:00"
lastmod: "2023-10-12T23:00:54+08:00"
draft: true
toc: true
tag:
  - Go
---

## GOPATH

Go 1.8版本之前GOPATH默认是空的，1.8版本之后会默认为GOPATH设置一个目录路径，它表示的是Go语言的工作目录，该目录下有三个子目录
- bin: 存放编译后生成的二进制可执行文件
- pkg: 存放编译后生成的.a文件
- src: 项目目录，以及go get下载的依赖包

`go env GOPATH`查看GOPATH配置

## Go Module

Go 1.11 版本加入了 Go Module 版本管理工具， go env 中有个变量 GO111MODULE(off, on, auto)

`go env GO111MODULE`查看GO111MODULE配置

当GO111MODULE=auto时，根据项目中是否有go.mod文件决定是否开启go mod

Go mod下载的包存储在$GOPATH/pkg/mod目录下

`go mod help`

```plaintext
	download    download modules to local cache
	edit        edit go.mod from tools or scripts
	graph       print module requirement graph
	init        initialize new module in current directory
	tidy        add missing and remove unused modules
	vendor      make vendored copy of dependencies
	verify      verify dependencies have expected content
	why         explain why packages or modules are needed
```

Go 1.11还引入了GOPROXY配置，默认情况下，go get 命令都是直接从vcs服务(比如github、gitlab等)下载module的，1.11之后可以通过设置GOPROXY环境变量来解决依赖包无法下载或下载缓慢的问题

国内常用配置值如下
```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

## Go work

Go 1.18版本引入了多模块工作区(Workspaces)