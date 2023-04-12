---
title: "Go语言之defer"
date: 2023-04-12 19:18:27
draft: false
tags:
- Go
categories:
- tech
---

## defer的用途

defer是在函数执行到最后时（return之前执行），多用于保证函数结束或panic前关闭响应的资源，如关闭文件句柄、恢复panic等
可以简化程序代码

关闭文件句柄
```go
package main

import (
    "fmt"
    "os"
)

func main(){
    fp, err := os.Open("filename")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer func(){
        fmt.Println("close file hanlder")
        fp.Close()
    }()

    fmt.Println("done")
}
```

恢复panic，防止程序崩溃
```go
package main

import (
    "fmt"
)

func main() {

    defer func(){
        if err := recover(); err != nil {
            fmt.Printf("got panic : %v\n", err)
        }
    }()

    panic("this is a panic")
}
```


## 多个defer的执行顺序

多个defer是一种栈的数据结构，先入后出

```go
package main

import (
    "fmt"
)

func main(){
    defer func(){
        fmt.Println("defer 1")
    }()
    defer func(){
        fmt.Println("defer 2")
    }()
    defer func(){
        fmt.Println("defer 3")
    }()
}
```

## defer与return的执行顺序

首先return的实现逻辑如下

- 第一步是给返回值赋值
    - 若为有名返回值则直接赋值
    - 若为无名返回值则先声明再赋值
- 第二步调用RET返回指令并传入返回值，RET会检查defer是否存在，若存在则先执行defer语句
- 最后RET携带返回值退出函数

return并不是一个**原子操作**，函数返回值与return返回值并不一定一致。defer、return、返回值三者的执行顺序是：return最先给返回值赋值，接着defer执行收尾工作，最后RET指令携带返回值退出函数

return非原子操作主要区分在函数返回值是有名还是无名

示例如下：


```go
package main

import (
    "fmt"
)

func main(){
    fmt.Println(foo1()) // 1
    fmt.Println(foo2()) // 2
    fmt.Println(foo3()) // 1
    fmt.Println(foo4()) // 0
    fmt.Println(foo5()) // 0
}

// 有名返回值
func foo1() (x int) {
    defer func(){
        x++
    }()
    return x
}

// 有名返回值
func foo2() (x int) {
    defer func(){
        x++
    }()
    return 1
}

// 有名返回值
func foo3() (x int) {
    defer incr(x)

    return 1
}

// 无名返回值
func foo4() int {
    x := 0
    defer func(){
        x++
    }()

    return x
}

// 无名返回值
func foo5() int {
    x := 0
    defer incr(x)

    return x
}

func incr(x int) {
    x++
}
```

## defer和panic的执行顺序

defer在panic之前执行

```go
package main

import (
    "fmt"
)

func main(){
    defer func(){
        fmt.Println("defer")
    }()

    panic("panic")
}
```

## defer声明时会先将参数值计算好

```go
package main

import (
    "fmt"
)

func main(){
    x := 1
    defer func(x int){
        fmt.Printf("defer x: %d\n", x) // 1
    }(x)

    x++

    fmt.Printf("x: %d\n", x) // 2
}
```