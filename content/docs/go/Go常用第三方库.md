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
|日志|{{< github repo="uber-go/zap" >}}|`go get -u go.uber.org/zap`|
|日志切割|{{< github repo="natefinch/lumberjack" >}}|`go get -u github.com/natefinch/lumberjack`|
|orm|{{< github repo="go-gorm/gorm" >}}|`go get -u gorm.io/gorm`|
|json|{{< github repo="tidwall/gjson" >}}|`go get -u github.com/tidwall/gjson`|
|配置管理|{{< github repo="spf13/viper" >}}||
|cli框架|{{< github repo="spf13/cobra" >}}||
|熔断限流|{{< github repo="alibaba/sentinel-golang" >}}|[文档](https://sentinelguard.io/zh-cn/docs/golang/basic-api-usage.html)|
|redis分布式锁|{{< github repo="go-redsync/redsync" >}}||
|mock|{{< github repo="agiledragon/gomonkey" >}}||
|时间|{{< github repo="golang-module/carbon" >}}||
|类型转换|{{< github repo="spf13/cast" >}}||

[参考](https://juejin.cn/post/7133520098123317256?searchId=202312271956026DC486012DB131F69B13)