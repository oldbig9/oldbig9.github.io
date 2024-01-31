---
weight: 999
title: "pprof分析"
description: ""
icon: "article"
date: "2023-12-20T09:49:46+08:00"
lastmod: "2023-12-20T09:49:46+08:00"
draft: false
toc: true
tag:
  - Go
category:
  - tech
---

## 服务增加 pprof 监控

```go
package main

import(
    "net/http"
    _ "net/http/pprof"
)

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // do something
}
```

pprof 包初始化方法里注册了相关路由地址

```go
func init() {
    http.HandleFunc("/debug/pprof/", Index)
    http.HandleFunc("/debug/pprof/cmdline", Cmdline)
    http.HandleFunc("/debug/pprof/profile", Profile)
    http.HandleFunc("/debug/pprof/symbol", Symbol)
    http.HandleFunc("/debug/pprof/trace", Trace)
}
```

gin 框架提供了 pprof 包，并且可以自定义路由地址

```go
package routers

import (
    "github.com/gin-contrib/pprof"
    "github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine{
    var router = gin.New()

    // pprof
    pprof.Register(router, "/model/dev/pprof")

    // do aomthing

    return router
}
```

## pprof 分析

浏览器打开 pprof 接口地址就可以查看相关数据
如：http://127.0.0.1:6060/debug/pprof/heap

```bash
# 命令行分析
$ go tool pprof http://127.0.0.1:6060/debug/pprof/heap
Fetching profile over HTTP from http://127.0.0.1:6060/debug/pprof/heap
Saved profile in /home/wwf/pprof/pprof.main.alloc_objects.alloc_space.inuse_objects.inuse_space.003.pb.gz
File: main
Build ID: 4c314f7cdc1bab8be7e93dab92a30eb0640c2409
Type: inuse_space
Time: Dec 26, 2023 at 2:34pm (CST)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top
Showing nodes accounting for 27845.55kB, 98.19% of 28357.59kB total
Showing top 10 nodes out of 57
      flat  flat%   sum%        cum   cum%
11922.80kB 42.04% 42.04% 11922.80kB 42.04%  github.com/feeds-recommend/experiment-api-go/unit.parseBucketInfoFU
 6411.55kB 22.61% 64.65%  6411.55kB 22.61%  golang.org/x/net/webdav.(*memFile).Write
 2110.76kB  7.44% 72.10% 17211.29kB 60.69%  github.com/feeds-recommend/experiment-api-go/manager.load
 2050.08kB  7.23% 79.33%  2050.08kB  7.23%  encoding/json.(*decodeState).literalStore
 1570.29kB  5.54% 84.86%  1570.29kB  5.54%  regexp/syntax.(*compiler).inst (inline)
 1127.65kB  3.98% 88.84%  1127.65kB  3.98%  reflect.unsafe_NewArray
    1025kB  3.61% 92.46%     1025kB  3.61%  runtime.allocm
  600.58kB  2.12% 94.57%  1113.90kB  3.93%  github.com/go-playground/validator/v10.init
  514.63kB  1.81% 96.39%   514.63kB  1.81%  google.golang.org/protobuf/internal/filedesc.(*File).initDecls
  512.20kB  1.81% 98.19%   512.20kB  1.81%  runtime.malg
(pprof)
```

### 可视化分析

原始的 pprof 数据不太方便分析，可以借助可视化工具[Graphviz](https://www.graphviz.org/download/)来生成火焰图等图表，使得我们更容易分析问题原因

```bash
curl -o heap.out http://localhost:6060/debug/pprof/heap
go tool pprof --http=:8080 heap.out

# 或直接打开网页
go tool pprof --http=:8080 http://localhost:6060/debug/pprof/heap
```

## 常见问题分析

### 内存泄露

服务器摘掉流量或流量高峰过去之后，分析 heap，可以观察出哪些变量没有被 GC 掉，由此判断内存泄露原因

<img src="https://oldbig9.github.io/hugo-blog/images/heap_inuse_space.png" width="30%" height="auto">

### goroutine 泄露

浏览器访问`http://127.0.0.1:6060/debug/pprof/goroutine?debug=1`即可看出 goroutine 数量比较多的协程

```plaintext
goroutine profile: total 58[总协程数量]
5[此处即是该协程数量] @ 0x447b16 0x457592 0xf6fefb 0xf61ff6 0x478761
#    0xf6fefa    github.com/pegasus-go-client/session.(*nodeSession).loopForDialing+0x7a    /home/wwf/go/src/demo/vendor/github.com/pegasus-go-client/session/session.go:150
#    0xf61ff5    gopkg.in/tomb%2ev2.(*Tomb).run+0x35                        /home/wwf/go/src/demo/vendor/gopkg.in/tomb.v2/tomb.go:163

4 @ 0x447b16 0x457592 0xccdc25 0x478761
#    0xccdc24    github.com/streaming/common/selfmetrics/falcon.(*Falcon).ReportRegistry+0xa4    /home/wwf/go/src/demo/vendor/github.com/streaming/LCSAgent-sdk/LCSAgent-sdk-golang/lcs/common/selfmetrics/falcon/falcon.go:73

3 @ 0x447b16 0x4130ec 0x412b58 0xb5c4c5 0x478761
#    0xb5c4c4    gopkg.in/natefinch/lumberjack%2ev2.(*Logger).millRun+0x44    /home/wwf/go/src/demo/vendor/gopkg.in/natefinch/lumberjack.v2/lumberjack.go:379

2 @ 0x447b16 0x440517 0x472769 0x4e3c32 0x4e4f9a 0x4e4f88 0x5e7089 0x5fad85 0x6e810d 0x56e783 0x56f36f 0x56f5c7 0x6736f9 0x6e34d9 0x6e34da 0x6e96aa 0x6edaab 0x478761
#    0x472768    internal/poll.runtime_pollWait+0x88        /usr/local/go-1.18.9/src/runtime/netpoll.go:302
#    0x4e3c31    internal/poll.(*pollDesc).wait+0x31        /usr/local/go-1.18.9/src/internal/poll/fd_poll_runtime.go:83
#    0x4e4f99    internal/poll.(*pollDesc).waitRead+0x259    /usr/local/go-1.18.9/src/internal/poll/fd_poll_runtime.go:88
#    0x4e4f87    internal/poll.(*FD).Read+0x247            /usr/local/
```
