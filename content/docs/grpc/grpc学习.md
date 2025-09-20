---
title: "Grpc学习"
date: 2023-02-13 19:47:48
draft: false
tags:
- Go
- grpc
categories:
- tech
---

## 依赖

protoc
```bash
wget https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-linux-x86_64.zip

unzip protoc-21.12-linux-x86_64.zip
cd protoc-21.12-linux-x86_64

./configure
make
sudo make install
```

protoc-gen-go、protoc-gen-go-grpc
```bash
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

## grpc-go

代码仓库：[https://github.com/grpc/grpc-go](https://github.com/grpc/grpc-go)

文档：[https://grpc.io/docs/languages/go/](https://grpc.io/docs/languages/go/)

克隆项目
```bash
git clone https://github.com/grpc/grpc-go.git
```

项目导入
```go
import "google.golang.org/grpc"
```

go安装依赖包
```bash
go get -u google.golang.org/grpc
```

生成pb代码
```bash
protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    helloworld/helloworld.proto
```

## 服务注册发现

grpc默认使用dns进行服务注册与发现，也可以自定义使用etcd或其他工具进行服务注册与发现

服务端注册并保持心跳
```go
func registerEndPointToEtcd(ctx context.Context, addr string) {
    // 创建 etcd 客户端
    etcdClient, _ := eclient.NewFromURL(MyEtcdURL)
    etcdManager, _ := endpoints.NewManager(etcdClient, MyService)


    // 创建一个租约，每隔 10s 需要向 etcd 汇报一次心跳，证明当前节点仍然存活
    var ttl int64 = 10
    lease, _ := etcdClient.Grant(ctx, ttl)
    
    // 添加注册节点到 etcd 中，并且携带上租约 id
    _ = etcdManager.AddEndpoint(ctx, fmt.Sprintf("%s/%s", MyService, addr), endpoints.Endpoint{Addr: addr}, eclient.WithLease(lease.ID))


    // 每隔 5 s进行一次延续租约的动作
    for {
        select {
        case <-time.After(5 * time.Second):
            // 续约操作
            resp, _ := etcdClient.KeepAliveOnce(ctx, lease.ID)
            fmt.Printf("keep alive resp: %+v", resp)
        case <-ctx.Done():
            return
        }
    }
}
```

客户端从etcd获取可用服务节点
```go
package main

import (
    // 标准库
    "context"
    "fmt"
    "time"

    // grpc 桩文件
    "github.com/grpc_demo/proto"

    // etcd
    eclient "go.etcd.io/etcd/client/v3"
    eresolver "go.etcd.io/etcd/client/v3/naming/resolver"


    // grpc
    "google.golang.org/grpc"
    "google.golang.org/grpc/balancer/roundrobin"
    "google.golang.org/grpc/credentials/insecure"
)

const MyService = "xiaoxu/demo"

func main() {
    // 创建 etcd 客户端
    etcdClient, _ := eclient.NewFromURL("my_etcd_url")
    
    // 创建 etcd 实现的 grpc 服务注册发现模块 resolver
    etcdResolverBuilder, _ := eresolver.NewBuilder(etcdClient)
    
    // 拼接服务名称，需要固定义 etcd:/// 作为前缀
    etcdTarget := fmt.Sprintf("etcd:///%s", MyService)
    
    // 创建 grpc 连接代理
    conn, _ := grpc.Dial(
        // 服务名称
        etcdTarget,
        // 注入 etcd resolver
        grpc.WithResolvers(etcdResolverBuilder),
        // 声明使用的负载均衡策略为 roundrobin     grpc.WithDefaultServiceConfig(fmt.Sprintf(`{"LoadBalancingPolicy": "%s"}`, roundrobin.Name)),
        grpc.WithTransportCredentials(insecure.NewCredentials()),
    )
    defer conn.Close()

    // 创建 grpc 客户端
    client := proto.NewHelloServiceClient(conn)
    for {
        // 发起 grpc 请求
        resp, _ := client.SayHello(context.Background(), &proto.HelloReq{
            Name: "xiaoxuxiansheng",
        })
        fmt.Printf("resp: %+v", resp)
        // 每隔 1s 发起一轮请求
        <-time.After(time.Second)
    }
}
```

[彻底搞懂gRPC名称解析](https://colin404.com/posts/d0kjpqc8aq48ats0154g/)

[基于etcd实现grpc服务注册与发现](https://zhuanlan.zhihu.com/p/623998314)

## 负载均衡

gprc默认采用pick_first方案，选取第一个可用的连接，并不具备负载均衡功能，grpc同时也内置了round_robin等负载均衡策略，可以在初始化client时进行配置，也可以自定义负载均衡策略并进行注册

```go
func main() {
    adress := "dns:localhost:8080"
    conn, err := grpc.NewClient(
		address,
        // 采用轮询的负载均衡策略
		grpc.WithDefaultServiceConfig(`{"loadBalancingPolicy":"round_robin"}`)
	)
}
```

[彻底搞懂gRPC负载均衡](https://colin404.com/posts/d0f0l948aq48ats0150g/)