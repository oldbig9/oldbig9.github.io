---
title: "Go常用第三方库"
date: 2023-01-16 16:04:38
draft: false
tags:
  - Go
categories:
  - tech
---

## 日志库

### [zap](https://github.com/uber-go/zap)

```shell
go get -u go.uber.org/zap
```

### 日志分割[lumberjack](https://github.com/natefinch/lumberjack)

```shell
go get -u github.com/natefinch/lumberjack
```

### [logrus](https://github.com/sirupsen/logrus)

```shell
go get -u github.com/sirupsen/logrus
```

## 数据库

### [gorm](https://github.com/go-gorm/gorm)

[文档](https://gorm.io/zh_CN/docs/index.html)

```shell
go get -u gorm.io/gorm
```

## JSON 库

### [gjson](https://github.com/tidwall/gjson)

```shell
go get -u github.com/tidwall/gjson
```

## 配置管理库

### viper

[viper](https://github.com/spf13/viper)

## cli 框架

[cobra](https://github.com/spf13/cobra)

## redis 分布式锁

[redsync](https://github.com/go-redsync/redsync)

## 熔断限流

[sentinel-golang](https://github.com/alibaba/sentinel-golang)

[文档](https://sentinelguard.io/zh-cn/docs/golang/basic-api-usage.html)

## mock

### [gomonkey](https://github.com/agiledragon/gomonkey)

### [gomock](https://github.com/golang/mock)

[参考](https://juejin.cn/post/7133520098123317256?searchId=202312271956026DC486012DB131F69B13)