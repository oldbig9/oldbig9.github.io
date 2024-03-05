---
weight: 100
title: "Go语言技巧"
description: "Go语言常用小技巧，持续更新中......"
icon: "article"
date: "2024-03-05T06:43:21Z"
lastmod: "2024-03-05T06:43:21Z"
draft: false
toc: true
tags:
- Go
categories:
- tech
series:
---

## Defer两阶段延迟执行

记录函数执行时间

```go
package main

import (
	"log"
	"time"
)

func main() {
	defer TrackingTime()()

	time.Sleep(time.Millisecond * 100)

	log.Println("执行结束")
}

func TrackingTime() func() {
	now := time.Now()
	log.Printf("开始时间: %d\n", now.UnixMilli())
	return func() {
		cost := time.Since(now).Milliseconds()
		log.Printf("耗时: %dms\n", cost)
	}
}
```

## 链式调用

常见例如gorm包等

```go
package main

import (
	"errors"
	"fmt"
)

func main() {
	p := &Person{}
	err := p.SetName("name").SetAge(18).Error()
	if err != nil {
		fmt.Printf("initialize person failed, %v\n", err)
	} else {
		fmt.Printf("%+v\n", p)
	}
}

type Person struct {
	Name string
	Age  int
	Err  error
}

func (p *Person) SetName(name string) *Person {
	if p.Err == nil {
		p.Name = name
	}

	// 错误处理
	p.SetError(errors.New("xxx"))

	return p
}

func (p *Person) SetAge(age int) *Person {
	if p.Err == nil {
		p.Age = age
	}

	return p
}

func (p *Person) SetError(err error) *Person {
	p.Err = err

	return p
}

func (p *Person) Error() error {
	return p.Err
}
```

## 切片转数组

go 1.20开始可以直接将切片转换为数组

```go
package main

import "fmt"

func main() {
	a := []int{1, 2, 3, 4}
	// b := [3]int(a[:3]) // go1.20+
	b := *(*[3]int)(a[:3]) // go1.19-, 注意切片长度需大于等于数组b的长度

	fmt.Printf("type: %T, value: %v\n", b, b)
}
```

## 错误合并

### wrap
go1.13增加了errors.Unwrap()、errors.Is()、errors.As()方法

fmt.Errorf()方法支持`%w`来前套错误

```go
package main

import (
	"errors"
	"fmt"
)

func main() {
	err1 := errors.New("error1")
	err2 := fmt.Errorf("error2: [%w]", err1)
	fmt.Println(err2) // error2: error1
	fmt.Println(errors.Unwrap(err2)) // error1
}
```

`errors.As(err error, target any) bool`

查找error中是否嵌套了target类型的错误，如果存在则将前套的错误赋值给target

```go
package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
)

func main() {
	if _, err := os.Open("non-existing"); err != nil {
		var pathError *fs.PathError
		if errors.As(err, &pathError) {
			fmt.Println("Failed at path:", pathError.Path)
		} else {
			fmt.Println(err)
		}
	}
}
```

### join

go1.20 加了errors.Join()方法，并修改了errors.Is()、errors.As()方法

```go
package main

import (
	"errors"
	"fmt"
)

func main() {
	err1 := errors.New("err1")
	err2 := errors.New("err2")
	err := errors.Join(err1, err2)
	fmt.Println(err)

	if errors.Is(err, err1) { // true
		fmt.Println("err is err1")
	}
	if errors.Is(err, err2) { // true
		fmt.Println("err is err2")
	}
}
```

## 判断interface{}是否真的为nil

```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
  var x interface{}
  var y *int = nil
  x = y

  if x != nil {
    fmt.Println("x != nil") // x != nil
  } else {
    fmt.Println("x == nil")
  }

  fmt.Println(x) // <nil>

  fmt.Println(IsNil(x)) // true
}

func IsNil(x interface{}) bool {
  if x == nil {
    return true
  }

  return reflect.ValueOf(x).IsNil()
}
```


