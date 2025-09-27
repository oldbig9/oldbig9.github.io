---
title: "Go常用第三方库"
date: 2023-01-16 16:04:38
draft: false
tags:
  - Go
categories:
  - tech
---

|功能|项目|备注|
|:--|:--|:--|
|日志|[https://github.com/uber-go/zap](https://github.com/uber-go/zap)|`go get -u go.uber.org/zap`|
|日志切割|[https://github.com/natefinch/lumberjack](https://github.com/natefinch/lumberjack)|`go get -u github.com/natefinch/lumberjack.v2`|
|orm|[https://github.com/go-gorm/gorm](https://github.com/go-gorm/gorm)|`go get -u gorm.io/gorm`|
|redis|[https://github.com/go-redis/redis](https://github.com/go-redis/redis)|`go get -u github.com/go-redis/redis/v9`|
|json操作|[https://github.com/tidwall/gjson](https://github.com/tidwall/gjson)|`go get -u github.com/tidwall/gjson`|
|json操作|[https://github.com/tidwall/sjson](https://github.com/tidwall/sjson)|`go get -u github.com/tidwall/sjson`|
|json序列化|[https://github.com/bytedance/sonic](https://github.com/bytedance/sonic)||
|配置管理|[https://github.com/spf13/viper](https://github.com/spf13/viper)||
|cli框架|[https://github.com/spf13/cobra](https://github.com/spf13/cobra)||
|类型转换|[https://github.com/spf13/cast](https://github.com/spf13/cast)||
|熔断限流|[https://github.com/alibaba/sentinel-golang](https://github.com/alibaba/sentinel-golang)|[文档](https://sentinelguard.io/zh-cn/docs/golang/basic-api-usage.html)|
|redis分布式锁|[https://github.com/go-redsync/redsync](https://github.com/go-redsync/redsync)||
|mock|[https://github.com/agiledragon/gomonkey](https://github.com/agiledragon/gomonkey)||
|时间|[https://github.com/golang-module/carbon](https://github.com/golang-module/carbon)||
|工具库|[https://github.com/duke-git/lancet](https://github.com/duke-git/lancet)|各种工具方法集合|
|prometheus|[https://github.com/prometheus/client_golang](https://github.com/prometheus/client_golang)|`go get -u github.com/prometheus/client_golang`|
|链路追踪||`go get -u go.opentelemetry.io/otel`|
|maxprocs|[https://github.com/uber-go/automaxprocs](https://github.com/uber-go/automaxprocs)|`go get -u github.com/uber-go/automaxprocs`, go1.25应该会解决容器环境cpu核数设置问题|
|限流|[https://github.com/uber-go/ratelimit](https://github.com/uber-go/ratelimit)|`go get -u go.uber.org/ratelimit`|
|测试框架|[https://github.com/stretchr/testify](https://github.com/stretchr/testify)|`go get -u github.com/stretchr/testify`|
|mock|[https://github.com/agiledragon/gomonkey](https://github.com/agiledragon/gomonkey)||
|swagger|[https://github.com/swaggo/swag](https://github.com/swaggo/swag)||
|uuid|[https://github.com/google/uuid](https://github.com/google/uuid)|`go get -u github.com/google/uuid`|
|rpc|[https://github.com/grpc/grpc-go](https://github.com/grpc/grpc-go)|`go get -u google.golang.org/grpc` [https://grpc.io/docs/languages/go/](https://grpc.io/docs/languages/go/)|
|服务注册发现|[https://github.com/etcd-io/etcd](https://github.com/etcd-io/etcd)||
|并发编程|[https://github.com/sourcegraph/conc](https://github.com/sourcegraph/conc)||
｜服务诊断|[https://github.com/google/gops](https://github.com/google/gops)|`$ go get -u github.com/google/gops`|
|协程池|[https://github.com/panjf2000/ants](https://github.com/panjf2000/ants)||


[参考](https://juejin.cn/post/7133520098123317256?searchId=202312271956026DC486012DB131F69B13)