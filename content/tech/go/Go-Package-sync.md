---
title: "Go Sync包"
date: 2023-06-13 14:16:58
draft: false
tags:
  - Go
categories:
  - tech
---

## WaitGroup

```go
type WaitGroup
func (wg *WaitGroup) Add(delta int)
func (wg *WaitGroup) Done()
func (wg *WaitGroup) Wait()
```

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	delta := 10
	wg.Add(delta)

	for i := 1; i <= delta; i++ {
		go func(i int) {
			defer wg.Done()
			fmt.Println("handle ", i)
		}(i)
	}

	wg.Wait()
	fmt.Println("done")
}
```

## Mutex

```go
type Mutex
func (m *Mutex) Lock() // 若锁正在被占用，则Lock()会被阻塞，直至锁被释放
func (m *Mutex) TryLock() bool // 尝试加锁，若锁被占用，则返回false，加锁失败
func (m *Mutex) Unlock() // 未被加锁的Mutex直接Unlock()则会fatal error: sync: unlock of unlocked mutex
```

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	var mu sync.Mutex
	m := make(map[string]int)

	for i := 1; i <= 10; i++ {
		go func(i int, m map[string]int) {
			mu.Lock()
			m["num"] += i
			mu.Unlock()
		}(i, m)
	}

	time.Sleep(5 * time.Second)

	fmt.Println(m)
}
```

## RWMutex

```go
type RWMutex
func (rw *RWMutex) Lock() // 读写锁
func (rw *RWMutex) RLock() // 读锁
func (rw *RWMutex) RLocker() Locker
func (rw *RWMutex) RUnlock()
func (rw *RWMutex) TryLock() bool
func (rw *RWMutex) TryRLock() bool
func (rw *RWMutex) Unlock()
```

和 mutex 类似，只不过功能更多，可以只加读锁

## Once

```go
type Once
func (o *Once) Do(f func()) // 只执行一次，不管f执行成功还是失败
```

常用于首次初始化数据、单例模式等

```go
package singleton

import "sync"

type singleton struct {
    // 单例对象的状态
}

var (
    instance *singleton
    once     sync.Once
)

func GetInstance() *singleton {
    once.Do(func() {
        instance = &singleton{}
        // 初始化单例对象的状态
    })
    return instance
}
```

## Pool

```go
type Pool
func (p *Pool) Get() any
func (p *Pool) Put(x any) // Go < v1.18 参数和返回值类型为interface{}
```

## Cond

```go
type Cond
func NewCond(l Locker) *Cond
func (c *Cond) Broadcast()
func (c *Cond) Signal()
func (c *Cond) Wait()
```

## Map

```go
type Map
func (m *Map) CompareAndDelete(key, old any) (deleted bool)
func (m *Map) CompareAndSwap(key, old, new any) bool
func (m *Map) Delete(key any)
func (m *Map) Load(key any) (value any, ok bool)
func (m *Map) LoadAndDelete(key any) (value any, loaded bool)
func (m *Map) LoadOrStore(key, value any) (actual any, loaded bool)
func (m *Map) Range(f func(key, value any) bool)
func (m *Map) Store(key, value any)
func (m *Map) Swap(key, value any) (previous any, loaded bool)

```
