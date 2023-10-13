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

Go 1.8 版本之前 GOPATH 默认是空的，1.8 版本之后会默认为 GOPATH 设置一个目录路径，它表示的是 Go 语言的工作目录，该目录下有三个子目录

- bin: 存放编译后生成的二进制可执行文件
- pkg: 存放编译后生成的.a 文件
- src: 项目目录，以及 go get 下载的依赖包

`go env GOPATH`查看 GOPATH 配置

## Go Module

Go 1.11 版本加入了 Go Module 版本管理工具， go env 中有个变量 GO111MODULE(off, on, auto)

`go env GO111MODULE`查看 GO111MODULE 配置

当 GO111MODULE=auto 时，根据项目中是否有 go.mod 文件决定是否开启 go mod

Go mod 下载的包存储在$GOPATH/pkg/mod 目录下

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

go.mod 文件中的依赖包可以通过 replace 替换依赖包下载地址或版本

原模块位置在=>左侧指定，替换内容居于右侧。右侧必须指定版本，但左侧不一定要指定版本，

使用本地 replace 命令，右侧可以不指定版本

```go
// go.mod文件
replace github.com/jonbodner/proteus => github.com/someone_else/my_proteus v1.0.0
```

## Go work

Go 1.18 版本引入了多模块工作区(Workspaces)，多模块工作区能够使开发者更容易的同时处理多个模块的工作，如：方便进行依赖的代码调试（打断点、修改代码）、排查依赖代码 bug。方便同时进行多个仓库/模块并行开发调试

`go help work`

```bash
edit        edit go.work from tools or scripts
init        initialize workspace file
sync        sync workspace build list to modules
use         add modules to workspace file
```

注：

- go work 主要用于本地开发，所以 go.work 文件不应提交到代码仓库
- 使用 go work 时，不同的项目文件必须有同一个根目录，推荐在$GOPATH 路径下执行`go work init`
- 目前仅`go build`会对 go.work 作出判断，`go mod tidy`不会影响工作区

## module 版本管理

### release 版本(tag)

```plaintext
v1.26.0
 | |  |_ _  修订号：做了向下兼容的问题补丁修正时更改修订号
 | |
 | |_ _ _ _ 次版本号：做了向下兼容的功能性更新时更改次版本号
 |
 |_ _ _ _ _ 主版本号: 做了不兼容更新时更改主版本号
```

### 伪版本(Pseudo-versions)

伪版本格式主要分为三部分

- 第一部分是最近打 tag 版本，如果没有打过 tag，就是 v0.0.0
- 第二部分是 commit 时间
- 第三部分就是 short commitId

```
vx.x.x-yyyymmddhhmmss-9d8a5bb208f5
```

当引用的一个包没有打版本 tag，或者`go get`命令指定 commitId 时，go.mod 文件中该依赖包就是以伪版本展示

例：执行命令 `go get -u gorm.io/gorm@9d8a5bb208f5616638cbaad878a12d5ac73970d3`

```go
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

## GOPROXY

Go 1.11 还引入了 GOPROXY 配置，默认情况下，go get 命令都是直接从 vcs 服务(比如 github、gitlab 等)下载 module 的，1.11 之后可以通过设置 GOPROXY 环境变量来解决依赖包无法下载或下载缓慢的问题

国内常用代理
|提供者|地址|
|:---|:---|
|官方全球代理|proxy.golang.com.cn|
|七牛云|goproxy.cn|
|阿里云|mirrors.aliyun.com/goproxy/|
|GoCenter|gocenter.io|
|百度|goproxy.bj.bcebos.com/|

```bash
# 设置GOPROXY,多个代理逗号分隔
go env -w GOPROXY=https://goproxy.cn,direct
```

`direct`为特殊指示符，用于指示 Go 回源到模块版本的源地址去抓取（如 Github 等），当只列表中上一个 Go Proxy 返回 404 或 410 错误时，Go 会自动尝试代理列表中的下一个，遇见`direct`时回源，遇见 EOF 时终止并抛出类似`invalid version: unknown revision...`的错误

## GOPRIVATE

go 项目中如果需要引入私有模块，则需要做如下修改

1.设置 GOPRIVATE，多个 private 使用逗号分隔

```bash
go env -w GOPRIVATE=github.com/ereshzealous
```

2.修改 Git 配置

```bash
git config --global url."https://${username}:${access_token}@github.com".insteadOf /
"https://github.com"
```
