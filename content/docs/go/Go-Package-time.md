---
title: "Go Time包"
date: 2023-06-08 10:58:57
draft: false
tags:
  - Go
categories:
  - tech
---

## 时间转换

```go
func Now() Time // Now returns the current local time.
func Unix(sec int64, nsec int64) Time
func UnixMicro(usec int64) Time // Go v1.17
func UnixMilli(msec int64) Time // Go v1.17
func (t Time) Unix() int64
func (t Time) UnixMicro() int64 // Go v1.17
func (t Time) UnixMilli() int64 // Go v1.17
func (t Time) UnixNano() int64  // Go v1.17
func ParseInLocation(layout, value string, loc *Location) (Time, error)
func (t Time) Format(layout string) string
```

### 获取当前时间戳

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    t := time.Now() // 当前时间

    fmt.Println(t.Unix()) // 秒时间戳
    fmt.Println(t.UnixMilli()) // 毫秒时间戳，Go V1.17新增
    fmt.Println(t.UnixMicro()) // 微秒时间戳，Go V1.17新增
    fmt.Println(t.UnixNano()) // 纳秒时间戳
}
```

### 时间戳转 string

常用 time layout 常量

```go
// 以下常量在Go v1.20加入
DateTime   = "2006-01-02 15:04:05"
DateOnly   = "2006-01-02"
TimeOnly   = "15:04:05"
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	timestamp := time.Now().Unix()
	dateString := timestampToDateString(timestamp)
	fmt.Println(dateString)
}

// 秒时间戳格式化为字符串
// 格式：2006-01-02 15:04:05
func timestampToDateString(timestamp int64) string {
	t := time.Unix(timestamp, 0)
	return t.Format("2006-01-02 15:04:05")
}
```

### 字符串转时间

```go
func Parse(layout, value string) (Time, error) // 返回UTC时间，非本地时区时间
func ParseInLocation(layout, value string, loc *Location) (Time, error) // 推荐使用
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	dateString := "2023-06-12 16:37:00"
	timestamp, _ := dateStringToTimestamp(dateString)

	fmt.Println(timestamp)
}

func dateStringToTimestamp(dateString string) (int64, error) {
	layout := "2006-01-02 15:04:05"
	t, err := time.ParseInLocation(layout, dateString, time.Local)
	if err != nil {
		return 0, err
	}

	return t.Unix(), nil
}
```

### 计算时间差

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	t1 := time.Now()
	t2 := t1.Add(10 * time.Minute)

	fmt.Println(t2.Sub(t1).Seconds())       // 600
	fmt.Println(t1.Sub(t2).Abs().Seconds()) // 600, Abs() added in Go v1.19
}
```

### time.Time.Add() Before() After() Equal()

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    t1 := time.Now()
    t2 := t1.Add(time.Hour*24)

    fmt.Println(t1.Before(t2)) // 判断时间t1是否在t2之前
}
```

### 获取年、月、日，周几...

```go
const (
	January Month = 1 + iota
	February
	March
	April
	May
	June
	July
	August
	September
	October
	November
	December
)
func (m Month) String() string

const (
	Sunday Weekday = iota
	Monday
	Tuesday
	Wednesday
	Thursday
	Friday
	Saturday
)
func (d Weekday) String() string
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.Now()

	fmt.Println(t.Year())         // 2023
	fmt.Println(int(t.Month()))   // 6
	fmt.Println(t.Day())          // 12
	fmt.Println(int(t.Weekday())) // 1

	year, month, day := t.Date()
    hour, minute, second := t.Clock()

	fmt.Println(year, int(month), day, hour, minute, second)
}
```

### time.ParseInLocation()

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    s := "2023-06-09 16:46:00"
    layout := "2006-01-02 15:04:05"

    t, _ := time.ParseInLocation(layout, s, time.Local)

    fmt.Println(t.UnixMilli())
}
```

### 获取指定时间戳对应 0 点时间戳

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    tsp := time.Now().UnixMilli()
    midnight := midnight(tsp)
    fmt.Println(midnight)
}

// 计算毫秒时间戳所在日期0点毫秒时间戳
func midnight(tsp int64) int64 {
    t := time.UnixMilli(tsp) // Go v1.17
    midnight := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.Local)
    // 注意 UnixMilli()方法是Go v1.17新增的
    // 1.17之前版本使用UnixNano() / 1e6实现
    return midnight.UnixMilli()
}
```

## 计时器

### time.Ticker

```go
type Ticker struct {
	C <-chan Time // The channel on which the ticks are delivered.
	// contains filtered or unexported fields
}

func NewTicker(d Duration) *Ticker
func (t *Ticker) Reset(d Duration)
func (t *Ticker) Stop()
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.NewTicker(time.Second) // 1秒间隔的定时器，类似js的setInterval()方法
	defer t.Stop() // 一定要记得stop计时器
	timeout := time.NewTimer(10 * time.Second) // 10秒定时器，类似js的setTimeout()方法

	for {
		select {
		case <-timeout.C:
			fmt.Println("timeout")
			return
		case curr := <-t.C:
			fmt.Println("current timestamp:", curr.Unix())
		}
	}
}
```

### time.Timer

```go
type Timer struct {
	C <-chan Time
	// contains filtered or unexported fields
}
func AfterFunc(d Duration, f func()) *Timer
func NewTimer(d Duration) *Timer
func (t *Timer) Reset(d Duration) bool
func (t *Timer) Stop() bool
```

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	timer := time.NewTimer(10 * time.Second)
	for {
		select {
		case <-timer.C:
			fmt.Println("timeout")
			goto LOOP
		}
	}

LOOP:
	fmt.Println("end")
}
```

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    _ = time.AfterFunc(time.Second*5, foo)

    time.Sleep(time.Second*10)
}

func foo() {
    fmt.Println("fooooooo...")
}
```
