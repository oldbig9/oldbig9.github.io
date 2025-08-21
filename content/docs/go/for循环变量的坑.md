---
weight: 100
title: "For循环变量的坑"
description: ""
icon: "article"
date: "2025-08-21T11:44:17+08:00"
lastmod: "2025-08-21T11:44:17+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

go 1.22之前，for循环变量是共享的，因此在并发场景下，需要注意循环变量的并发安全问题

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    for i := 0; i < 5; i++ {
        go func() {
            fmt.Println(i) // go1.22之前输出都为5，go1.22之后输出为随机顺序0 1 2 3 4
        }()
    }
    
    time.Sleep(time.Second)
}

```