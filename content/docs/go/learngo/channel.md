---
weight: 100
title: "Go Channel"
description: ""
icon: "article"
date: "2025-09-20T15:55:42+08:00"
lastmod: "2025-09-20T15:55:42+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 底层结构

```go
type hchan struct {
    qcount   uint           // chan 里元素数量
    dataqsiz uint           // chan 底层循环数组的长度
    buf      unsafe.Pointer // 指向底层循环数组的指针,只针对有缓冲的 channel
    elemsize uint16         // chan 中元素大小
    closed   uint32         // chan 是否被关闭的标志
    elemtype *_type         // chan 中元素类型
    sendx    uint           // 已发送元素在循环数组中的索引
    recvx    uint           // 已接收元素在循环数组中的索引
    recvq    waitq          // 等待接收的 goroutine 队列
    sendq    waitq          // 等待发送的 goroutine 队列
    lock mutex              // 保护 hchan 中所有字段
}
```