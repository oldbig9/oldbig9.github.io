---
weight: 999
title: "Go包管理"
description: ""
icon: "article"
date: "2023-10-12T23:00:54+08:00"
lastmod: "2023-10-12T23:00:54+08:00"
draft: false
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

go.mod文件中的依赖包可以通过replace替换依赖包下载地址或版本, 如
```go
// go.mod文件
module example

go 1.18

require (
	"xxx" v1.2.3
)

replace "xxx" "xxx" v1.2.4
```


Go 1.11还引入了GOPROXY配置，默认情况下，go get 命令都是直接从vcs服务(比如github、gitlab等)下载module的，1.11之后可以通过设置GOPROXY环境变量来解决依赖包无法下载或下载缓慢的问题

国内常用配置值如下
```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

## Go work

Go 1.18版本引入了多模块工作区(Workspaces)，多模块工作区能够使开发者更容易的同时处理多个模块的工作，如：方便进行依赖的代码调试（打断点、修改代码）、排查依赖代码bug。方便同时进行多个仓库/模块并行开发调试

`go help work`
```bash
edit        edit go.work from tools or scripts
init        initialize workspace file
sync        sync workspace build list to modules
use         add modules to workspace file
```

注：
- go work主要用于本地开发，所以go.work文件不应提交到代码仓库
- 使用go work时，不同的项目文件必须有同一个根目录，推荐在$GOPATH路径下执行`go work init`
- 目前仅`go build`会对go.work作出判断，`go mod tidy`不会影响工作区

## module版本管理

### release版本(tag)

```plaintext
v1.26.0
 | |  |_ _  修订号：做了向下兼容的问题补丁修正时更改修订号
 | | 
 | |_ _ _ _ 次版本号：做了向下兼容的功能性更新时更改次版本号
 |
 |_ _ _ _ _ 主版本号: 做了不兼容更新时更改主版本号
```

### 伪版本

伪版本格式主要分为三部分
- 第一部分是最近打tag版本，如果没有打过tag，就是v0.0.0
- 第二部分是commit时间
- 第三部分就是short commitId 
```
vx.x.x-yyyymmddhhmmss-9d8a5bb208f5
```

当引用的一个包没有打版本tag，或者`go get`命令指定commitId时，go.mod文件中该依赖包就是以伪版本展示

例：执行命令 `go get -u gorm.io/gorm@9d8a5bb208f5616638cbaad878a12d5ac73970d3`
``` go
module github.com/oldbig9/hugo-blog

go 1.20

require (
	github.com/colinwilson/lotusdocs v0.1.0 // indirect
	github.com/gohugoio/hugo-mod-bootstrap-scss/v5 v5.20300.20200 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	gorm.io/gorm v1.25.5-0.20231010064548-9d8a5bb208f5 // indirect
)
```
