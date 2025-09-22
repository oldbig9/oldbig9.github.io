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

## channel特性

### 1. 向一个已关闭的channel发送数据会触发panic

### 2. 从一个已关闭的有缓冲channel中仍可以读取数据

### 3. 关闭channel是否会触发异常
    - 重复关闭channel会触发异常: panic: close of closed channel
    - 关闭一个nil值的channel会触发异常: panic: close of nil channel
    - 关闭一个只有接受方向的channel会变异错误：invalid operation: cannot close receive-only channel a (variable of type <-chan int)

## channel select机制

select的执行机制是随机的，如果多个case同时满足条件，Go会随机选择一个执行，避免饥饿问题。
如果没有case能执行就会执行default，如果没有default，当前goroutine会阻塞等待

## channel分配在堆上

channel用于协程间通信，作用域和声明周期可能不仅限于某个函数内，所以一般情况，go都是将其分配在堆上