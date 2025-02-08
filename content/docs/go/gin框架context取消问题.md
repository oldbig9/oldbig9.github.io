---
weight: 100
title: "gin框架请求方超时取消请求问题"
description: ""
icon: "article"
date: "2025-02-07T09:39:54+08:00"
lastmod: "2025-02-07T09:39:54+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

调用方设置了请求超时时间，如果请求超时，request中的context会cancel，因此用到context进行http调用，
mysql、redis操作等都会因context失败，而有些接口业务逻辑中，是不希望处理流程中断的，因为会导致数据不一致。

解决的办法不使用gin框架默认的context，增加context替换的中间件
```go
func UninterruptibleMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // WithoutCancel()方法是go1.21加入的，所以之前的版本，可以新建context来替换
        c.Request = c.Request.WithContext(context.WithoutCancel(c.Request.Context()))
        c.Next()
    }
}
```
[https://levelup.gitconnected.com/go-ep6-keep-contexts-going-with-context-withoutcancel-3d57b1b0b530](https://levelup.gitconnected.com/go-ep6-keep-contexts-going-with-context-withoutcancel-3d57b1b0b530)
