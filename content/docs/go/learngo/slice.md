---
weight: 100
title: "Go Slice"
description: ""
icon: "article"
date: "2025-09-20T14:25:29+08:00"
lastmod: "2025-09-20T14:25:29+08:00"
draft: true
toc: true
tags:
categories:
- tech
series:
---

## 切片底层数据结构

```go
// src/runtime/slice.go
type slice struct {
	array unsafe.Pointer // 底层数组指针
	len   int            // 切片长度
	cap   int            // 切片容量
}
```

## 切片扩容

- go1.17及之前
    - 如果期望容量大于当前容量的两倍，就会使用期望容量
    - 如果当前切片容量小于1024，就会将容量翻倍
    - 如果当前切片容量大于1024，就会每次增加25%，直至新容量大于期望容量
- go1.18及之后
    - 如果当前容量小于256，则会将容量翻倍
    - 如果当前容量大于256则按newcap += (newcap + 3*threshold) >> 2，当切片长度足够大时，newcap趋近于1.25倍oldcap

```go
//  测试slice扩容，go 1.25
package main

import (
    "fmt"
)

func main() {
    s := make([]int, 0)
	for i := 0; i < 10000; i++ {
		oldCap := cap(s)
		s = append(s, i)
		if oldCap != 0 && oldCap != cap(s) {
			t.Logf("cap: %d, rate: %.2f", oldCap, float64(cap(s))/float64(oldCap))
		}
	}
}

// 输出，可见slice扩容随着长度增加确实是趋近于1.25倍的
//oldcap: 4, rate: 2.00
//oldcap: 8, rate: 2.00
//oldcap: 16, rate: 2.00
//oldcap: 32, rate: 2.00
//oldcap: 64, rate: 2.00
//oldcap: 128, rate: 2.00
//oldcap: 256, rate: 2.00
//oldcap: 512, rate: 1.66
//oldcap: 848, rate: 1.51
//oldcap: 1280, rate: 1.40
//oldcap: 1792, rate: 1.43
//oldcap: 2560, rate: 1.33
//oldcap: 3408, rate: 1.50
//oldcap: 5120, rate: 1.40
//oldcap: 7168, rate: 1.29
```

go1.25源码
```go
func growslice(oldPtr unsafe.Pointer, newLen, oldCap, num int, et *_type) slice {
	oldLen := newLen - num
    ......

	newcap := nextslicecap(newLen, oldCap)

    ......
	return slice{p, newLen, newcap}
}

// nextslicecap computes the next appropriate slice length.
func nextslicecap(newLen, oldCap int) int {
	newcap := oldCap
	doublecap := newcap + newcap
	if newLen > doublecap {
		return newLen
	}

	const threshold = 256
	if oldCap < threshold { // 小于256则双倍容量
		return doublecap
	}
	for {
		// Transition from growing 2x for small slices
		// to growing 1.25x for large slices. This formula
		// gives a smooth-ish transition between the two.
		newcap += (newcap + 3*threshold) >> 2 // 循环计算，直到newcap满足新的切片长度需求

		// We need to check `newcap >= newLen` and whether `newcap` overflowed.
		// newLen is guaranteed to be larger than zero, hence
		// when newcap overflows then `uint(newcap) > uint(newLen)`.
		// This allows to check for both with the same comparison.
		if uint(newcap) >= uint(newLen) {
			break
		}
	}

	// Set newcap to the requested cap when
	// the newcap calculation overflowed.
	if newcap <= 0 {
		return newLen
	}
	return newcap
}
```