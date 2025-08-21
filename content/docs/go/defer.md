---
weight: 100
title: "Defer方法"
description: ""
icon: "article"
date: "2025-08-21T10:17:48+08:00"
lastmod: "2025-08-21T10:17:48+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

defer方法可以用来延迟执行函数，通常用来释放资源，如关闭文件、数据库连接、方法监控打点等

defer方法的定义不能在return之后，否则无法执行

## defer执行顺序

### 多个defer

defer是执行压栈再出栈的执行顺序，因此先定义的defer会最后执行

```go
package main

import (
    "fmt"
)

func main() {
    for i := range 5 {
        defer fmt.Println(i) // 4 3 2 1 0
    }
}

```


### defer的执行顺序

1. 返回值 = x
2. 调用defer函数
3. 空的return

*如果方法是具名返回值，且defer方法对具名返回值进行了修改，那方法返回的是被修改后的值*

如下所示

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println(foo()) // 如期输出1，实际输出2
}

func foo() (x int) {
    x = 1
    
    defer func() {
        x++
    }()

    return x
}
```

## defer语句表达式的值在定义时就确定了

```go
package main

import (
    "fmt"
)

func main() {
    x := 1
    defer fmt.Println("defer x: ", x) // 1
    x++
    fmt.Println("x: ", x) // 2
}
```

```go
package main

import (
    "fmt"
)

func main() {
    x := 1
    defer foo(x) // 2
    // 可以通过指针参数方式，来修改defer语句表达式的值
    defer foo2(&x) // 4
    x++
    fmt.Println("x: ", x) // 2
}

func foo(x int) {
    fmt.Println("foo x:", x * 2)
}

func foo2(x *int) {
    fmt.Println("foo2 x:", *x * 2)
}
```


## defer恢复panic

即使程序panic了，defer方法也会执行，这也是defer的一个重要特性，因此也可以用来panic恢复，打印panic堆栈信息等

```go
package main

import (
    "fmt"
    "runtime/debug"
)

func main() {
    // defer输出panic日志
    defer func() {
        if err := recover(); err != nil {
            fmt.Println("recover: ", err)
            fmt.Println("stack trace: ", string(debug.Stack()))
        }
    }()
    panic("panic")
}
```